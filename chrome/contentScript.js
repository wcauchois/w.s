chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  sendResponse({url: window.location.href});
});
