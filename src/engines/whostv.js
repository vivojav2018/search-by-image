import {validateUrl} from 'utils/app';
import {runOnce} from 'utils/common';
import {initSearch, prepareImageForUpload, sendReceipt} from 'utils/engines';

const engine = 'whostv';

async function search({session, search, image, storageIds} = {}) {
  image = await prepareImageForUpload({
    image,
    engine,
    target: 'api'
  });

  const data = new FormData();
  data.append('file', image.imageBlob, 'image.png');

  const rsp = await fetch('https://whos.tv/upload-search', {
    method: 'POST',
    body: data
  });

  if (rsp.status !== 200) {
    throw new Error(`API response: ${rsp.status}, ${await rsp.text()}`);
  }

  const tabUrl = (await rsp.text()).trim();

  await sendReceipt(storageIds);

  if (validateUrl(tabUrl)) {
    window.location.replace(tabUrl);
  }
}

function init() {
  initSearch(search, engine, taskId, {canvasAccess: true});
}

if (runOnce('search')) {
  init();
}
