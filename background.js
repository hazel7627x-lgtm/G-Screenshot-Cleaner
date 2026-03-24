// Keep service worker alive via periodic alarm
chrome.alarms.create('keepAlive', { periodInMinutes: 0.4 });
chrome.alarms.onAlarm.addListener(() => { /* heartbeat - keeps worker alive */ });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'cleanup') {
    fetch('http://127.0.0.1:13337/cleanup', { method: 'POST' })
      .then(res => res.json())
      .then(data => console.log('Cleanup result:', data))
      .catch(err => console.error('Cleanup failed (is server running?):', err));
  }
});
