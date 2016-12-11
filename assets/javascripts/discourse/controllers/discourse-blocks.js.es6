import ModalFunctionality from 'discourse/mixins/modal-functionality';
import AjaxLib from 'discourse/lib/ajax';

export default Ember.Controller.extend(ModalFunctionality, {
  gistUrl: "",

  actions: {
    apply: function() {
      var self = this;
      var gistUrl = self.get("gistUrl")
      var output = `[block]${gistUrl}[/block]`
      if (self.composerViewOld) {
        self.composerViewOld.addMarkdown(output);
      } else if (self.composerView) {
        self.composerView._addText(self.composerView._getSelected(), output);
      }
      this.send('closeModal');
    },
  },

  onShow: function() {
    this.setProperties({"gistUrl": ""});
  },

  init: function () {
    this._super();
  },
});
