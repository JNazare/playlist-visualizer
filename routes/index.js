var echojs = require('echojs');

var echo = echojs({
  key: 'FILDTEOIK2HBORODV' //process.env.ECHONEST_KEY
});

exports.index = function(req, res){
	// echo('song/search').get({
	//   artist: 'zedd',
	//   title: 'spectrum'
	// }, function (err, json) {
	//   console.log(json.response);
	// });
  res.render('index', { title: 'Express' });
};

exports.new = function(req, res){
	var T = req.body.tempo.split(" - ");
	var D = req.body.dance.split(" - ");
	var H = req.body.hot.split(" - ");
	var F = req.body.fam.split(" - ");
	echo('song/search').get({
	  style: req.body.genre,
	  mood: req.body.mood,
	  min_tempo: T[0],
	  max_tempo:T[1],
	  song_min_hotttnesss: H[0],
	  song_max_hotttnesss: H[1],
	  min_danceability: D[0],
	  max_danceability: D[1],
	  artist_min_familiarity: F[0],
	  artist_max_familiarity: F[1]
	}, function (err, json) {
		console.log(json.response.songs[0].id);
	 	console.log(json.response);
	});
	res.send('Request received: duration = ' + req.body.duration + 'mins, genres = ' + req.body.genre + ', moods = ' + req.body.mood + ', tempo = ' + req.body.tempo + ', danceability = ' + req.body.dance + ', familiarity = ' + req.body.fam + ', hotness = ' + req.body.hot);
}