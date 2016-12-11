# name: discourse-blocks
# about: Add graph rendering in posts
# version: 0.0.1
# authors: Jeffrey Gu
# url: https://github.com/jgujgu/discourse-blocks

enabled_site_setting :discourse_blocks_enabled

register_asset 'stylesheets/discouse_blocks.scss'
register_asset 'javascripts/d3.min.js'


after_initialize do
  require_dependency 'application_controller'
  require_dependency 'excerpt_parser'
  require_dependency 'nokogiri'

  GITHUB_CLIENT_ID = ENV["GITHUB_CLIENT_ID"]
  GITHUB_SECRET_KEY = ENV["GITHUB_SECRET_KEY"]

  module ::DiscourseBlocks
    class Engine < ::Rails::Engine
      engine_name "discourse_blocks"
      isolate_namespace DiscourseBlocks
    end
  end

  class DiscourseBlocks::GistsController < ::ApplicationController
    def show
      url = "https://api.github.com/gists/#{params[:id]}?client_id=#{GITHUB_CLIENT_ID}&client_secret=#{GITHUB_SECRET_KEY}"
      response = Faraday.get url
      body = JSON.parse(response.body)
      if body["message"] == "Not Found"
        render json: "Not Found", status: 404
      else
        render json: response.body
      end
    end
  end

  Discourse::Application.routes.append do
    mount ::DiscourseBlocks::Engine, at: "/gists"
  end

  DiscourseBlocks::Engine.routes.draw do
    get '/:id' => 'gists#show'
  end

  DiscourseEvent.on(:post_created) do |post, opts, user|
    save_thumbnail(post)
  end

  DiscourseEvent.on(:post_edited) do |post, opts, user|
    save_thumbnail(post)
  end

  def save_thumbnail(post)
    doc = Nokogiri::HTML(post.cooked)
    doc_class = doc.xpath('//div/@class')
    if doc_class[0] && doc_class[0].value == "gist"
      gist_id = doc.xpath('//div/@data-gist')[0].value
      username = doc.xpath('//div/@data-username')[0].value
      url = "https://gist.githubusercontent.com/#{username}/#{gist_id}/raw/thumbnail.png"
      post.custom_fields['gist_thumbnail_url'] = url
      post.save!
    else
      post.custom_fields['gist_thumbnail_url'] = nil
      post.save!
    end
  end

  require 'topic_list_item_serializer'
  class ::TopicListItemSerializer
    attributes :gist_thumbnail_url

    def gist_thumbnail_url
      accepted_id = object.custom_fields["accepted_answer_post_id"].to_i
      if accepted_id > 0 && accepted_post = Post.find_by(id: accepted_id)
        thumbnail_url = accepted_post.custom_fields['gist_thumbnail_url']
      else
        thumbnail_url = object.custom_fields['gist_thumbnail_url']
      end
    end
  end

  TopicList.preloaded_custom_fields << "gist_thumbnail_url" if TopicList.respond_to? :preloaded_custom_fields
end
