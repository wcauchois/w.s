$(document).ready(function() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {requestUrl: true}, function(response) {
      //response.url
    });
  });
});
