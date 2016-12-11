import { acceptance } from "helpers/qunit-helpers";

acceptance('Discourse Blocks', { loggedIn: true, settings: { discourse_blocks_enabled: true }});

test('the block appears', () => {
  visit("/");

  andThen(() => {
    ok(exists('#create-topic'), 'the create button is visible');
  });

  click('#create-topic');

  andThen(() => {
    ok(exists('.discourse_blocks_button'), 'the blocks button is visible');
  });

  click('.discourse_blocks_button');

  andThen(() => {
    ok(exists('#blocks-modal'), 'the blocks modal is visible');
  });


  var validGistUrl = "http://bl.ocks.org/mbostock/4248145";
  fillIn('input[name=blocks-gist-url]', validGistUrl);
  click('#blocks-submit');

  andThen(() => {
    equal(
      find(".d-editor-input").val(),
      `[block]${validGistUrl}[/block]`,
      'it should contain the right output'
    );
  });

  andThen(() => {
    ok(exists('.gist'), 'the blocks div is visible');
  });

  //andThen(() => {
    //setTimeout(function() {
      //var gistTitle = "Hexagonal Binning";
      //equal(
        //find(".gist-title").val(),
        //gistTitle,
        //'it should contain the right title'
      //);
    //}, 2000);
  //});
});
