import parseCode from 'discourse/plugins/discourse-blocks/discourse/lib/parseCode';
import { default as PrettyText, buildOptions } from 'pretty-text/pretty-text';

function createBlock(gistId, uniqueGist) {
  var serverUrl = "/gists/" + gistId;
  $.get(serverUrl).success(function(gist) {
    var indexHtml = gist.files["index.html"];
    if (indexHtml) {
      setupIFrame(gist, uniqueGist);
      updateGistDomObjects(gist, uniqueGist);
    } else {
      createFailText(uniqueGist);
    }
  }).error(function(jqXHR, textStatus, errorThrown) {
    createFailText(uniqueGist);
  });
}

function updateGistDomObjects(gist, uniqueGist) {
  var $pGist = $("#p-gist-" + uniqueGist);
  var externalLink = '<i class="fa fa-external-link" aria-hidden="true"></i>';
  $pGist.html(externalLink + " view on bl.ocks");
  $pGist.attr("data-url", "http://bl.ocks.org/" + gist.id);
  $pGist.click(function(e) {
    e.stopPropagation();
    var $this = $(this);
    open($this.data('url'));
  });
  $("#h1-gist-" + uniqueGist).html(gist.description);
  $("#p-loading-gist-" + uniqueGist).remove();
  var readme = gist.files["README.md"];
  if (readme) {
    var readmeContent = readme.content;
    const readmeResult = new PrettyText().cook(readmeContent);
    $("#div-gist-" + uniqueGist).html(readmeResult);
  }
}

function createFailText(uniqueGist) {
  var failIcon = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'
  var $pLoadingGist = $("#p-loading-gist-" + uniqueGist);
  $pLoadingGist.removeClass("animate-flicker");
  $pLoadingGist.html(failIcon + " Block failed to load.");
  $("#iframe-gist-" + uniqueGist).css("height", "0px");
}


function setupIFrame(gist, uniqueGist) {
  // select the iframe node we want to use
  // if the element doesn't exist, we're outta here
  var gistSelector = 'iframe-gist-' + uniqueGist;
  if (!document.getElementById(gistSelector)) { return false; }
  var gistNode = window.d3.select("#" + gistSelector);
  gistNode.empty();
  var iframe = gistNode.node();
  iframe.sandbox = 'allow-scripts allow-popups allow-forms';

  var template = parseCode(gist.files['index.html'].content, gist.files);
  updateIFrame(template, iframe);
}

function updateIFrame(template, iframe) {
  var blobUrl;
  window.URL.revokeObjectURL(blobUrl);
  var blob = new Blob([template], { type: 'text/html' });
  blobUrl = URL.createObjectURL(blob);
  if (!iframe.src) {
    iframe.src = blobUrl;
  } else {
    iframe.contentWindow.location.replace(blobUrl);
  }
}

export default createBlock;
