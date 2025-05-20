// After mdn-bcd-collector's tests page is loaded, run the test.
onload = () => {
  // collector will generate a script based on the test environment settings.
  // We only need the parameters from the script and call the bcd.go function by ourselves.
  let run_str = document.getElementById('run').onclick.toString();
  const resourceCount = extractResourceCount(run_str);

  bcd.go(onBcdTestComplete, resourceCount, true, {
    name: 'servo',
    version: '1',
  });
};

async function onBcdTestComplete(results) {
  await sendReport(results);

  // Trigger report export.
  // This will make collector generate a json report in the `collector/download/` directory.
  let exportElement = document.getElementById('export');
  exportElement.submit();

  console.log('Export submitted');

  // Close the window to terminate the servo process.
  window.close();
}

function extractResourceCount(input) {
  const match = input.match(/undefined,\s*(\d+),/);
  return match ? parseInt(match[1], 10) : null;
}

async function sendReport(results) {
  console.log('Sending report');

  const resultsURL =
    (location.origin || location.protocol + '//' + location.host) +
    '/api/results?for=' +
    encodeURIComponent(location.href);

  const response = await fetch(resultsURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(results),
  });

  if (!response.ok) {
    console.error('Failed to send report:', response.statusText);
  } else {
    console.log('Report sent successfully');
  }
}
