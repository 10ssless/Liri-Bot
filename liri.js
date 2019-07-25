require("dotenv").config();
var axios = require("axios");
var Spotify = require('node-spotify-api');
var fs = require('fs');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var task = process.argv[2]
var search;
var do_what = false;

var prepStr = function (str) {
    // allow for search queries with spaces btw words
    var newStr = "";
    for (var i = 0; i < str.length; i++) {
        var cc = str.substring(i, i + 1)
        if (cc == " ") {
            newStr += "+"
        } else {
            newStr += cc
        }
    }
    return newStr
}

function search_movie(name){
    axios.get("http://www.omdbapi.com/?t="+name+"&y=&plot=short&apikey=trilogy").then(
        function (response) {
            let movie = response.data;

            let logEntry = [
                "Movie: " + movie.Title,
                "Year: " + movie.Year,
                "IMDB Rating: " + movie.imdbRating,
                "Country: " + movie.Country,
                "Languages: " + movie.Language,
                "Plot: " + movie.Plot,
                "Cast: " + movie.Actors,
                ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
                "\n"
            ].join("\n")   

            fs.appendFile("log.txt",logEntry,"utf8",function(err,data){
                console.log(logEntry)
            })
        });
}

function search_concert(artist){
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
        function (response) {
            let show = response.data[0];
            let showDate = show.datetime
            let dash1 = showDate.indexOf("-")
            let dash2 = showDate.indexOf("-",dash1+1)
            let t = showDate.indexOf("T", dash2 + 1)
            let year = showDate.substring(0,dash1)
            let month = showDate.substring(dash1+1,dash2)
            let day = showDate.substring(dash2+1,t)

            let logEntry = [
                artist+"'s next show is...\n",
                "Venue: "+show.venue.name,
                "Date: "+month+"/"+day+"/"+year,
                "City: "+show.venue.city,
                "State: "+show.venue.region,
                "Country: "+show.venue.country,
                "Tickets: "+show.offers[0].status,
                "URL: "+show.offers[0].url,
                ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
                "\n"
            ].join("\n")

            fs.appendFile("log.txt", logEntry, "utf8", function (err, data) {
                console.log(logEntry)
            })

        });
}

function search_spotify(song){
    spotify.search({
        type: 'track',
        query: song,
    }, function (err, data) {
        if (err) {
            return console.log('Spotify error: ' + err);
        }
        let array = data.tracks.items

        let logEntry = [
            "Artist: "+array[0].artists[0].name,
            "Song: "+array[0].name,
            "Album: "+array[0].album.name,
            "Link: "+array[0].album.external_urls.spotify,
            ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
            "\n"
        ].join("\n")

        fs.appendFile("log.txt", logEntry, "utf8", function (err, data) {
            console.log(logEntry)
        })

    });
}

var nts = []
function do_whatever(){
    do_what = true
    fs.readFile("random.txt","utf8",function(err,data){
        if (err) {
            return console.log('ReadFile error: ' + err);
        }
        let lines = data.split(",");
        task = lines[0]
        search = lines[1].substring(1,lines[1].length-1)
        
        if (task == "spotify-this-song") {
            search_spotify(search);
        } else if (task == "movie-this") {
            search_movie(search);
        }
        else if (task == "concert-this") {
            search_concert(search);
        }
    })
    
}

switch(task){
    case "concert-this":
        search = process.argv.slice(3).join(" ");
        if (search == null) {
            search_concert("Lil Nas X")
        } else {
            search_concert(search)
        }
        break;
    case "spotify-this-song":
        search = process.argv.slice(3).join(" ");
        if (search == null) {
            search_spotify("The Sign")
        } else {
            search_spotify(search)
        }
        break;
    case "movie-this":
        search = process.argv.slice(3).join(" ");
        if(search==null){
            search_movie("Mr. Nobody")
        }
        else{
            search_movie(search)
        }
        break;
    case "do-whatever":
        do_whatever();
        break;
    default:
        do_whatever();
        break;
}
