chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 
    enabled: true,
    replacedCount: 0
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'incrementCount') {
    chrome.storage.local.get('replacedCount', data => {
      const newCount = (data.replacedCount || 0) + 1;
      chrome.storage.local.set({ replacedCount: newCount });
    });
  }
}); 