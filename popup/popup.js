document.addEventListener('DOMContentLoaded', function() {
  const enableToggle = document.getElementById('enableToggle');
  const statusText = document.getElementById('statusText');
  const replacedCount = document.getElementById('replacedCount');
  const refreshBtn = document.getElementById('refreshBtn');
  
  // 加载存储的设置
  chrome.storage.local.get(['enabled', 'replacedCount'], function(result) {
    enableToggle.checked = result.enabled !== false; // 默认为true
    statusText.textContent = enableToggle.checked ? '已启用' : '已禁用';
    replacedCount.textContent = result.replacedCount || 0;
  });
  
  // 切换启用/禁用状态
  enableToggle.addEventListener('change', function() {
    const enabled = enableToggle.checked;
    statusText.textContent = enabled ? '已启用' : '已禁用';
    
    chrome.storage.local.set({ enabled: enabled }, function() {
      // 通知内容脚本状态已更改
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleState', enabled: enabled });
        }
      });
    });
  });
  
  // 刷新按钮
  refreshBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  });
}); 