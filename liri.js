require("dotenv").config();

//variables for npm packages
var inquirer = require("inquirer")
var request = require("request");
var fs = require("fs");

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

//spotify and twitter ids
var keys = require("./keys");

var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
})

var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
})

// To take the user input
inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Hi! What is your name?'
    },
    {
        type: 'list',
        name: 'options',
        message: "Pick one of the choices below!",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
    }
]).then(function (user) {
    console.log(user.name + "." + " You picked " + user.options + ".");

    if (user.options === "spotify-this-song") {
        //prompt user to key in a song
        inquirer.prompt([{
            type: 'input',
            name: 'song',
            message: 'Give me a song to spotify?',
            default: 'The Sign'

        }]).then(function (song) {
            console.log(song);
            var query = "";
            if (song) {
                //get the song name in as a string
                for (var k in song) {
                    query = query+"+"+song[k];
                }

                //Use node-spotify-api to search and display data
                spotify.search({
                    type: 'track',
                    query: query

                }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                    console.log(JSON.stringify(data.tracks.items, null, 2))
                    console.log("=====================================================")
                    console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
                    console.log("Song: " + JSON.stringify(data.tracks.items[0].name));
                    console.log("Preview: " + JSON.stringify(data.tracks.items[0].artists[0].preview_url, null, 2));
                    console.log("Album Name: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
                });
            } else {
                spotify.search({
                    type: 'track',
                    query: user.default,
                    limit: 1

                }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                    console.log(JSON.stringify(data[0].album, null, 2))
                    //not working as expected. showing a different artist and album.
                    for (var i = 0; i < data.length; i++) {

                        if (data[i].album.artists[0].name === "ace of base") {
                            console.log("=====================================================");
                            console.log("Artist: " + JSON.stringify((data[i].album.artists[0].name, null, 2)));
                            console.log("Song: " + JSON.stringify(data[i].album.name));
                            console.log("Preview: " + JSON.stringify(data[i].album.preview_url, null, 2));
                            console.log("Album Name: " + JSON.stringify(data[i].album.name, null, 2))
                        }
                    }

                })
            }
        })
    } //if the user picked movie this
    else if (user.options === "movie-this") {
        //prompt user to give a movie name
        inquirer.prompt([{
            type: "input",
            name: "movie",
            message: "Give me a movie name?",
            default: "Mr. Nobody"
        }]).then(function (movie) {
            console.log(movie);
            var movieName = "";

            if (movie) {
                for (var k in movie) {
                    movieName = movieName + movie[k];
                }
                //request OMDB for movie data and display it on the console
                var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy"
                console.log(queryURL);

                request(queryURL, function (error, response, body) {
                    console.log(JSON.parse(body));
                    console.log("=====================================================");
                    console.log("Title: " + JSON.parse(body).Title);
                    console.log("Year Released: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
                    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value);
                    console.log("Country: " + JSON.parse(body).Country);
                    console.log("Language: " + JSON.parse(body).Language);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("Actors: " + JSON.parse(body).Actors);

                })
            } else {
                movieName = this.default;
                console.log(movieName)
            }

        })

    }
    //if the user picked "do-what-it-says"
    else if (user.options === "do-what-it-says") {
        //read the text from "random.txt"
        fs.readFile("random.txt", "utf8", function (error, data) {
            var songName = "";
            var dataArr = data.split(" ");
            if (error) {
                return console.log(error);
            }
            //grab the data from randon.txt and convert it in to string
            for (var i = 1; i < dataArr.length; i++) {
                songName = songName + "+" + dataArr[i];
                console.log(songName);
            }
            spotify.search({
                    type: 'track',
                    query: songName

                },
                function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                    console.log(JSON.stringify(data.tracks.items, null, 2))
                    console.log("=====================================================")
                    console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
                    console.log("Song: " + JSON.stringify(data.tracks.items[0].name));
                    console.log("Preview: " + JSON.stringify(data.tracks.items[0].album.preview_url, null, 2));
                    console.log("Album Name: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
                });
        })
    }
    //if the user chose "my-tweets"
    else if (user.options === "my-tweets") {
        //hit the twitter api for node
        var params = {
            screen_name: 'chitramaddy'
        };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for(var i=0; i < tweets.length; i++){
                    console.log("=====================================================")
                    console.log("Timeline: "+tweets[i].created_at);
                    console.log("Tweet: "+tweets[i].text);
                    
                }
                
            }
        });
    }
});