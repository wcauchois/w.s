function saveOptions() {
  if (document.getElementById('dev').checked) {
    localStorage['mode'] = 'dev';
  } else if (document.getElementById('prod').checked) {
    localStorage['mode'] = 'prod';
  }
  var name = document.getElementById('name').value;
  if (name != '') localStorage['name'] = name;
  var status = document.getElementById("status");
  status.innerHTML = 'Options Saved.';
  setTimeout(function() {
    status.innerHTML = '';
  }, 750);
}
function restoreOptions() {
  var mode = localStorage['mode'];
  if (mode == undefined) {
    mode = 'prod';
    localStorage['mode'] = mode;
  }
  document.getElementById('dev').checked = (mode == 'dev');
  document.getElementById('prod').checked = (mode == 'prod');
  var name = localStorage['name'];
  if (name != undefined)
    document.getElementById('name').value = name;
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('#save').addEventListener('click', saveOptions);
