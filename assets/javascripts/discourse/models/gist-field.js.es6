Ember.Object.extend({
  url: function() {
    const url = this.get('url') || "";
    return url;
  }.property('url')
});
