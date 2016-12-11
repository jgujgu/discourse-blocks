import { withPluginApi } from 'discourse/lib/plugin-api';
import Composer from 'discourse/components/d-editor';
import showModal from 'discourse/lib/show-modal';
import createBlock from 'discourse/plugins/discourse-blocks/discourse/lib/create-block';
import InputValidation from 'discourse/models/input-validation';

function makeBlock($elem) {
  var $gist = $('.gist', $elem);
  var gistId = $gist.data("gist");
  if (gistId) {
    var d = new Date();
    var n = d.getTime().toString();
    var uniqueGist = gistId + n;
    $gist.attr("id", "gist-" + uniqueGist);
    gistId = gistId.toString();
    var gistReg = /(\w+)$/;
    if (gistId && gistId.match(gistReg)) {
      setTimeout(function() {
        addLoadingGistPlaceholder(uniqueGist);
        createGistDomObjects(uniqueGist);
        createBlock(gistId, uniqueGist);
      }, 100);
    }
  }
}

function addLoadingGistPlaceholder(uniqueGist) {
  $(`<p id="p-loading-gist-${uniqueGist}" class="animate-flicker"><i class="fa fa-bar-chart" aria-hidden="true"></i> Loading Block Data...</p>`).appendTo("#gist-" + uniqueGist);
}

function createGistDomObjects(uniqueGist) {
  $('<h1>', {
    id: "h1-gist-" + uniqueGist,
    class: "gist-title"
  }).appendTo("#gist-" + uniqueGist);
  $('<p>', {
    id: "p-gist-" + uniqueGist,
    class: "block-url"
  }).appendTo("#gist-" + uniqueGist);
  $('<iframe>', {
    id: "iframe-gist-" + uniqueGist,
  }).appendTo("#gist-" + uniqueGist);
  $('<div>', {
    id: "div-gist-" + uniqueGist,
  }).appendTo("#gist-" + uniqueGist);
}

function initializePlugin(api) {
  Composer.reopen({
    actions: {
      showDiscourseBlocks: function () {
        showModal('discourse-blocks', { title: 'blocks.modal_title' }).setProperties({composerView: this});
      }
    }
  });

  api.decorateCooked(makeBlock);

  api.onToolbarCreate(toolbar => {
    toolbar.addButton({
      id: "discourse_blocks_button",
      group: "extras",
      icon: "bar-chart",
      action: 'showDiscourseBlocks'
    });
  });
}

export default {
  name: 'discourse-blocks',
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    if (siteSettings.discourse_blocks_enabled) {
      withPluginApi('0.5', initializePlugin, { noApi: () => decorateCooked(container, makeBlock) });
    }
  }
};
