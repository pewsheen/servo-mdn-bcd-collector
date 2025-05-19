onload = () => {
  let run_str = document.getElementById('run').onclick.toString();
  const resourceCount = extractResourceCount(run_str);

  bcd.go(onBcdTestComplete, resourceCount, true, {
    name: 'servo',
    version: '1',
  });
};

function onBcdTestComplete(results) {
  sendReport(results);

  let exportElement = document.getElementById('export');
  exportElement.submit();

  close();
}

function extractResourceCount(input) {
  const match = input.match(/undefined,\s*(\d+),/);
  return match ? parseInt(match[1], 10) : null;
}

function sendReport(results) {
  const body = JSON.stringify(results);

  if (!('XMLHttpRequest' in self)) {
    updateStatus(
      'Cannot upload results: XMLHttpRequest is not supported.',
      'error-notice'
    );
    return;
  }

  const client = new XMLHttpRequest();

  const resultsURL =
    (location.origin || location.protocol + '//' + location.host) +
    '/api/results?for=' +
    encodeURIComponent(location.href);

  client.open('POST', resultsURL);
  client.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  client.send(body);
  client.onreadystatechange = function () {
    if (client.readyState == 4) {
      if (client.status >= 200 && client.status <= 299) {
        console.log('Results uploaded.');
      } else {
        console.log('Failed to upload results: server error.');
        console.log('Server response: ' + client.response);
      }
    }
  };
}
