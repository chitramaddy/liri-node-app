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
        //prompt user to pick a song
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
                    query = query + " " + song[k];
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

                    console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
                    console.log("Song: " + JSON.stringify(data.tracks.items[0].name));
                    console.log("Preview: " + JSON.stringify(data.tracks.items[0].artists[0].preview_url, null, 2));
                    console.log("Album Name: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
                });
            } else {
                spotify.search({
                    type: 'track',
                    query: user.default

                }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                    console.log(JSON.stringify(data, null, 2))
                    var items = data.tracks.items;
                    for(i=0; i < items.length; i++){
                        if(items[i].name === "ace of base"){
                            console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
                            console.log("Song: " + JSON.stringify(data.tracks.items[0].name));
                            console.log("Preview: " + JSON.stringify(data.tracks.items[0].artists[0].preview_url, null, 2));
                            console.log("Album Name: " + JSON.stringify(data.tracks.items[0].album.name, null, 2))
                        }
                    }

                   

                })
            }
        })
    }
});


//  var songName = process.argv[3]; //capture userInput and query it below 

//  params = songName;
//     spotify.search({ type: 'track', query: params }, function(err, data) {
//         if ( err ) {
//             console.log('Error occurred: ' + err);
//             return;  
//         }
//         else{
//             output = space + "================= DATA HERE ==================" + 
//             space + "Song Name: " + "'" +songName.toUpperCase()+ "'" +
//             space + "Album Name: " + data.tracks.items[0].album.name +
//             space + "Artist Name: " + data.tracks.items[0].album.artists[0].name +  
//             space + "URL: " + data.tracks.items[0].album.external_urls.spotify + "\n\n\n";
//             console.log(output);    
//             };
//     });
// client.get('favorites/list', function(error, tweets, response) {
//     if(error) throw error;
//     console.log(tweets);  // The favorites. 
//     console.log(JSON.parse(response));  // Raw response object. 
//   });

//Show list options mytweets,spotify, movie, do what it says

//confirm what the user chooses and store it in a variable

//write switch cases for options and call respective functions

//write function my tweets to show latest 20 tweets

//write function spotify to retrieve song data, use a for loop to create an array of the song and send it to spotify

//write function movie to request movie data from omdb, for loop to create an array of the movie name or default "Mr. Nobody"

// function{
//     if(movie=true){
//         for()
//     }else{
// Mr. Nobody
//     }
// }


//Write a function to read file random_txt and play the song from spotify