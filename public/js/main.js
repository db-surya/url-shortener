// Show Topic Input
function showTopicInput() {
  document.getElementById('topicInput').classList.remove('hidden');
  document.getElementById('aliasInput').classList.add('hidden');
}

// Show Alias Input
function showAliasInput() {
  document.getElementById('aliasInput').classList.remove('hidden');
  document.getElementById('topicInput').classList.add('hidden');
}

// Submit Analytics by Topic
function submitTopicAnalytics() {
  const topic = document.getElementById('topicField').value;
  fetch(`/api/analytics/topic/${topic}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('resultBox').textContent = JSON.stringify(data, null, 2);
    })
    .catch((error) => {
      console.error('Error fetching analytics by topic:', error);
      document.getElementById('resultBox').textContent = 'Error fetching analytics by topic.';
    });
}

// Submit Analytics by Alias
function submitAliasAnalytics() {
  const alias = document.getElementById('aliasField').value;
  fetch(`/api/analytics/${alias}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('resultBox').textContent = JSON.stringify(data, null, 2);
    })
    .catch((error) => {
      console.error('Error fetching analytics by alias:', error);
      document.getElementById('resultBox').textContent = 'Error fetching analytics by alias.';
    });
}

// Show Overall Analytics
function showOverallAnalytics() {
  fetch('/api/analytics/overall')
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('resultBox').textContent = JSON.stringify(data, null, 2);
    })
    .catch((error) => {
      console.error('Error fetching overall analytics:', error);
      document.getElementById('resultBox').textContent = 'Error fetching overall analytics.';
    });
}
