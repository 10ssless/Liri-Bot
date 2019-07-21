require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var task = process.argv[2]


function search_spotify(song){
    spotify.search({
        type: 'track',
        query: song,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        let array = data.tracks.items
        console.log("Artist: "+array[0].artists[0].name)
        console.log("Song: "+array[0].name)
        console.log("Album: "+array[0].album.name)
        console.log("Link: "+array[0].album.external_urls.spotify)
        console.log(" ")
    });
}


switch(task){
    case "spotify-this-song":
        let search = process.argv[3];
        search_spotify(search);
        break;
    default:
        console.log("Something went wrong...");
        break;
}