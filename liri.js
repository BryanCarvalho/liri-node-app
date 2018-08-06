require("dotenv").config();

var keys = require('./keys');
var fs = require('fs');
var request = require(`request`);
var Spotify = require('node-spotify-api');

var command = process.argv[2];
var content = process.argv[3];
var spotify = new Spotify(keys.spotify);

if (command === "spotify-this-song") {
    spotifyRun();
}

else if (command === "movie-this") {
    omdbRun();
}

else if (command === "do-what-it-says") {
    whatItSays();
};

function spotifyRun() {
    if (!content) {
        content = "Ace of Base";
    }

    spotify.search({ type: "track", query: content, limit: 1 }, function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }

        data = JSON.parse(JSON.stringify(data));

        console.log(
            `Artist(s): ${data.tracks.items[0].album.artists[0].name}`,
            `\nSong Name: ${data.tracks.items[0].name}`,
            `\nPreview Link: ${data.tracks.items[0].preview_url}`,
            `\nAlbum: ${data.tracks.items[0].album.name}`
        );
    });
};

function omdbRun() {
    if (!content) {
        content = "Mr.Nobody";
    }

    var omdb = `http://www.omdbapi.com/?t="${content}"&y=&plot=short&apikey=trilogy`;

    request(omdb, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            body = JSON.parse(body, null, 2);
            console.log(
                `Title: ${body.Title}`,
                `\nYear: ${body.Year}`,
                `\nIMDB Rating: ${body.imdbRating}`,
                `\n${body.Ratings[1].Source} Rating: ${body.Ratings[1].Value}`,
                `\nCountry Produced: ${body.Country}`,
                `\nLanguage: ${body.Language}`,
                `\nPlot: ${body.Plot}`,
                `\nActors: ${body.Actors}`
            );
        }
    });
}

function whatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }

        data = data.split(",");
        command = data[0];
        content = data[1];
    });
}