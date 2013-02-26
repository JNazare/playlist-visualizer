var echojs = require('echojs');

var echo = echojs({
  key: 'FILDTEOIK2HBORODV' //process.env.ECHONEST_KEY
});

exports.index = function(req, res){
	echo('song/search').get({
	  artist: 'zedd',
	  title: 'spectrum'
	}, function (err, json) {
	  console.log(json.response);
	});
  res.render('index', { title: 'Express' });
};