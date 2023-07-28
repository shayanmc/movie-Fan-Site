
var express = require("express");
var router = express.Router();
const request = require("request");

// const apiKey = "1fb720b97cc13e580c2c35e1138f90f8";
const apiKey = "a56d0602b2814f7b9525f4ee565b8edb";
// const apiKey = '123456789';
const apiBaseUrl = "http://api.themoviedb.org/3";
// const apiBaseUrl = 'http://localhost:3030';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = "http://themoviedb.org/t/p/w300";

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  request.get(nowPlayingUrl, (error, response, movieData) => {
    // console.log("========The error========")
    // console.log(error)
    // console.log("========The response========")
    // console.log(response)
    // console.log(movieData);
    const parsedData = JSON.parse(movieData);
    // res.json(parsedData)
    res.render("index", {
      parsedData: parsedData.results,
    });
  });
});

// /movie/:id is a wildcard route.
// that means that :id is going to be stored in...
router.get("/movie/:id", (req, res, next) => {
  // res.json(req.params.id);
  const movieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
  // res.send(thisMovieUrl)
  request.get(thisMovieUrl, (error, response, movieData) => {
    console.log(typeof movieData);
    const parsedData = JSON.parse(movieData);
    res.render("single-movie", {
      parsedData,
    });
  });
});

router.post("/search", (req, res, next) => {
  // res.send("Sanity Check")
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;
  // res.send(movieUrl)
  request.get(movieUrl, (error, response, movieData) => {
    let parsedData = JSON.parse(movieData);
    // res.json(parsedData);
    if (cat == "person") {
      parsedData.results = parsedData.results[0].known_for;
    }
    res.render("index", {
      parsedData: parsedData.results,
    });
  });
});

module.exports = router;
