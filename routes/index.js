var echojs = require('echojs');

var echo = echojs({
  key: process.env.ECHONEST_KEY // 'FILDTEOIK2HBORODV'
});

exports.index = function(req, res){
	res.render('index', { title: 'Playlist Generator' });
};

exports.rdio = function(req, res){
	var dur = req.body.duration*60;
	var limit = req.body.duration*60;
	var T = [req.body.tempo1, req.body.tempo2];
	var D = [req.body.dance1, req.body.dance2];
	var H = [req.body.hot1, req.body.hot2];
	echo('song/search').get({
		style: req.body.genre,
		mood: req.body.mood,
		min_tempo: Number(T[0])-20,
		max_tempo: Number(T[0])+20,
		song_min_hotttnesss: Number(H[0])-0.2,
		song_max_hotttnesss: Number(H[0])+0.2,
		min_danceability: Number(D[0])-0.2,
		max_danceability: Number(D[0])+0.2,
		sort: 'key-asc',
		results: 100,
		bucket: ['tracks', 'id:rdio-US','audio_summary'],
	}, function (err, json) {
		var i = 0;
		var plist = [];
		var songInfo = [];
		while (dur>limit/2) {
			if(json.response.songs[i].tracks != [] && json.response.songs[i].tracks[0]){
				dur -= json.response.songs[i].audio_summary.duration;
				var j = (json.response.songs[i].tracks[0].foreign_id).split(":");
				var rdio_id = j[2]
				plist.push(rdio_id);
				songInfo.push([json.response.songs[i].artist_name, json.response.songs[i].title]);
			}
			i++;
		}
		echo('song/search').get({
			style: req.body.genre,
			mood: req.body.mood,
			min_tempo: Number(T[1])-20,
			max_tempo: Number(T[1])+20,
			song_min_hotttnesss: Number(H[1])-0.2,
			song_max_hotttnesss: Number(H[1])+0.2,
			min_danceability: Number(D[1])-0.2,
			max_danceability: Number(D[1])+0.2,
			results: 100,
			sort: 'key-asc',
			bucket: ['tracks', 'id:rdio-US','audio_summary'],
		}, function (err, json) {
			var i = 0;
			while (dur>60) {
				if(json.response.songs[i].tracks != [] && json.response.songs[i].tracks[0]){
					dur -= json.response.songs[i].audio_summary.duration;
					var j = (json.response.songs[i].tracks[0].foreign_id).split(":");
					var rdio_id = j[2]
					plist.push(rdio_id);
					songInfo.push([json.response.songs[i].artist_name, json.response.songs[i].title]);
				}
				i++;
			}
			plist = JSON.stringify(plist);
			res.render('rdio', {ids: plist, songs: songInfo});
		});
	});
}