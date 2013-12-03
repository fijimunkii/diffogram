function getPulls(link) {
  return $.ajax({
    url: 'https://api.github.com/repos/' + link + '/pulls',
    type: 'GET'
  });
}

function getAdiff(owner, repo, id) {
  return $.ajax({
    url: '/get/' + owner + '/' + repo + '/' + id,
    type: 'GET'
  });
}

function getDiffs(link) {
  var diffs = [];

  getPulls(link).done(function(data) {
    for (var i=0; i<data.length; i++) {
      diffs.push(data[i].diff_url);
    }

    var stripped = diffs[0].slice(19,diffs[0].length);
    var owner = stripped.slice(0, stripped.indexOf('/'));
    stripped = stripped.slice(stripped.indexOf('/')+1, stripped.length);
    var repo = stripped.slice(0, stripped.indexOf('/'));

    for (var i=1; i<=diffs.length; i++) {
      getAdiff(owner, repo, i).done(function(data) {
        while (data.data.indexOf('\n') !== -1) {
          var currentLine = data.data.slice(0, data.data.indexOf('\n'));
          $('#terminal').typist('type', currentLine);
          $('#terminal').typist('prompt');
          $('#terminal').typist('wait', 2000);
          data.data = data.data.slice(data.data.indexOf('\n')+1, data.data.length);
        }
      });
    }

  }); // /getPulls.done()

}



$(function() {

  $('#terminal').typist({
    height: '100%',
    backgroundColor: '#000',
    textColor: 'rgb(89, 209, 33)',
    fontFamily: 'Delicious'
  })
  .typist('prompt')
  .typist('speed', 'fast');

  setInterval(function() {
    window.scrollTo(0,document.body.scrollHeight);
  }, 100);

  setInterval(function() {
    prettyPrint();
  }, 1000);

  // setInterval(function() {
  //   var termVal = $('#terminal').val();
  //   if (termVal.length > 1000) {
  //     termVal = termVal.slice(1000, termVal.length);
  //     $('#terminal').val(termVal);
  //   }
  // }, 60000);

  // setInterval(function() {
  //   var $term = $('#terminal');
  //   var termChildren = $term[0].children;

  //   termChildren = termChildren.slice(termChildren.length-20, termChildren.length);

  //   $term.html('');

  //   for (var i=0; i<termChildren.length; i++) {
  //     $term[0].appendChild(termChildren[i]);
  //   }
  // }, 60000);

  //TODO make the clearing function only remove lines offscreen

  setInterval(function() {
    $('#terminal').html('');
  }, 120000);

  $('#repo-form').on('submit', function(e) {
    e.preventDefault();
    var repo = $('#repo-input').val();
    getDiffs(repo);
    $('#repo-form').fadeOut(2000);
  });

});
