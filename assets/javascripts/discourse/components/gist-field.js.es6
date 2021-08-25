import discourseComputed from "discourse-common/utils/decorators";
import InputValidation from 'discourse/models/input-validation';

export default Ember.Component.extend({
  classNames: ['gist-field'],

  @discourseComputed('gist-field.url')
  gistValidation(url) {
    let reason;
    //if (url < 1) {
      //reason = I18n.t('composer.error.title_missing');
    //} else if (missingTitleChars > 0) {
      //reason = I18n.t('composer.error.title_too_short', {min: minimumTitleLength});
    //} else if (titleLength > this.siteSettings.max_topic_title_length) {
      //reason = I18n.t('composer.error.title_too_long', {max: this.siteSettings.max_topic_title_length});
    //}

    if (reason) {
      return InputValidation.create({ failed: true, reason, lastShownAt: lastValidatedAt });
    }
  }
});
