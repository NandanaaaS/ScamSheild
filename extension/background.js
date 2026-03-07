chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeText",
    title: "Analyze with ScamShield",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "scanQrImage",
    title: "Scan QR with ScamShield",
    contexts: ["image"],
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
  } else if (info.menuItemId === "scanQrImage") {
    chrome.storage.local.set({ qrImageUrl: info.srcUrl }, () => {
      chrome.windows.create({
        url: "index.html?qrImage=1",
        type: "popup",
        width: 360,
        height: 280,
      });
    });
  }
});
