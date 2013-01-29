var config = localStorage['mode'] == 'prod' ? prod_config : dev_config;
var serverUrl = 'http://' + config['HOST'] + ':' + config['PORT'];
var currentAuthor = (localStorage['name'] == undefined || localStorage['name'] == '') ? 'Anonymous' : localStorage['name'];

$(document).ready(function() {
  var textarea = $('#compose textarea');
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {requestUrl: true}, function(response) {
      var currentUrl = response.url;
      textarea.keydown(function(event) {
        if (event.which == 13) {
          if (textarea.val() != '') {
            $.post(
              serverUrl + '/post',
              $.param({
                body: textarea.val(),
                author: currentAuthor,
                url: currentUrl
              }),
              function() {
                var statusDiv = $('#compose .status');
                statusDiv.html('Post successful');
                setTimeout(function() {
                  statusDiv.html('');
                }, 750);
              }
            );
          }

          event.preventDefault();
          textarea.val('');
        }
      });
    });
  });
});
