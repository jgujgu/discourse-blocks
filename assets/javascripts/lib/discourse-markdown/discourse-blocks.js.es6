import { registerOption } from 'pretty-text/pretty-text';

registerOption((siteSettings, opts) => {
  opts.features['discourse-blocks'] = !!siteSettings.discourse_blocks_enabled;
});

function insertGist(_, gist) {
  var gistInfo = getGistInfo(gist);
  if (gistInfo[1] && gistInfo[2]) {
    return `<div class='gist' data-gist='${gistInfo[2]}' data-username='${gistInfo[1]}'></div>`;
  }
}

function getGistInfo(gist) {
  var gistReg = /(\w+)\/(\w+)$/;
  var matches = gist.match(gistReg);
  if (matches[1] && matches[2]) {
    return matches;
  }
}

function replaceGists(text) {
  text = text || "";
  while (text !== (text = text.replace(/\[block\]((?:(?!\[block\]|\[\/block\])[\S\s])*)\[\/block\]/ig, insertGist)));
  return text;
}

export function setup(helper) {
  helper.whiteList([ 'div.gist' ]);
  helper.addPreProcessor(replaceGists);
}
