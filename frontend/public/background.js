chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scamshield",
    title: "Analyze with ScamShield",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "scamshield") {
    chrome.storage.local.set({ selectedText: info.selectionText });
    chrome.action.openPopup();
  }
});