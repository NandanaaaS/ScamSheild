chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeText",
    title: "Analyze with ScamShield",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "analyzeText") {
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      
      chrome.windows.create({
        url: "index.html",
        type: "popup",
        width: 360,
        height: 280,
      });

    });
  }
});