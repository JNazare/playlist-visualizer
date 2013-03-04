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
	var dur = req.body.duration*60;
	var limit = req.body.duration*60;
	var T = req.body.tempo.split(" - ");
	var D = req.body.dance.split(" - ");
	var H = req.body.hot.split(" - ");
	echo('song/search').get({
		style: req.body.genre,
		mood: req.body.mood,
		min_tempo: Number(T[0])-20,
		max_tempo: Number(T[0])+20,
		song_min_hotttnesss: Number(H[0])-0.2,
		song_max_hotttnesss: Number(H[0])+0.2,
		min_danceability: Number(D[0])-0.2,
		max_danceability: Number(D[0])+0.2,
		bucket: ['tracks', 'id:rdio-US','audio_summary'],
	}, function (err, json) {
		console.log('response 1', json.response);
		var i = 0;
		var plist = [];
		while (dur>limit/2) {
			if(json.response.songs[i].tracks != [] && json.response.songs[i].tracks[0]){
				console.log('i= ', i);
				dur -= json.response.songs[i].audio_summary.duration;
				var j = (json.response.songs[i].tracks[0].foreign_id).split(":");
				var rdio_id = j[2]
				plist.push(rdio_id);
			}
			// plist.push('id: ' + json.response.songs[i].id + ' duration: ' + json.response.songs[i].audio_summary.duration + ' tempo: ' + json.response.songs[i].audio_summary.tempo);
			i++;
		}
		console.log('starting search 2');
		echo('song/search').get({
			style: req.body.genre,
			mood: req.body.mood,
			min_tempo: Number(T[1])-20,
			max_tempo: Number(T[1])+20,
			song_min_hotttnesss: Number(H[1])-0.2,
			song_max_hotttnesss: Number(H[1])+0.2,
			min_danceability: Number(D[1])-0.2,
			max_danceability: Number(D[1])+0.2,
			bucket: ['tracks', 'id:rdio-US','audio_summary'],
		}, function (err, json) {
			console.log('response 2', json.response);
			var i = 0;
			while (dur>60) {
				if(json.response.songs[i].tracks != [] && json.response.songs[i].tracks[0]){
					dur -= json.response.songs[i].audio_summary.duration;
					var j = (json.response.songs[i].tracks[0].foreign_id).split(":");
					var rdio_id = j[2]
					plist.push(rdio_id);
				}
				// plist.push('id: ' + json.response.songs[i].id + ' duration: ' + json.response.songs[i].audio_summary.duration + ' tempo: ' + json.response.songs[i].audio_summary.tempo);
				i++;
			}
			// console.log(plist);
			// Replace res.send below with res.render for the rdio page
			res.send('See terminal for ids');
		});
	});
	// res.send('Request received: duration = ' + req.body.duration + 'mins, genres = ' + req.body.genre + ', moods = ' + req.body.mood + ', tempo = ' + req.body.tempo + ', danceability = ' + req.body.dance + ', familiarity = ' + req.body.fam + ', hotness = ' + req.body.hot);
}