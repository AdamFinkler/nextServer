"use strict";
const express = require("express");
const path = require("path");
const logger = require("morgan");
const movies = require("./movies.json");
const getResponseFromOpenAi = require("./openAiRequest.js");
const {
  getRecommendedMovies,
  extractMoviesFromAnswer,
  getCachedTitles,
} = require("./utils.js");
const app = express();
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "dist")));

app.get("/movies", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  const limit = parseInt(req.query.limit) || 60;
  const offset = parseInt(req.query.offset) || 0;

  const paginatedMovies = movies.slice(offset, offset + limit);
  const arr = [];
  movies.forEach((movie) => {
    arr.push(movie.title);
  });

  res.send(
    paginatedMovies,
  );
});

app.get("/movies/search", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const searchTerm = req.query.searchTerm.toLowerCase();
  const filteredMoviesBySearch = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm)
  );
  res.send(
    filteredMoviesBySearch,
  );
});

app.get("/movies/recommended", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const idArray = req.query.ids;
    if (idArray.length === 0) res.send([]);
    const recommendedMovies = await getRecommendedMovies(idArray, movies);
    res.send(recommendedMovies);
  } catch (e) {
    console.log("error in recommended route: ", e);
  }
});

app.get("/movies/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send(movies.filter((movie) => movie.id === req.params.id));
});

app.listen(3000, function () {
  console.log(`app listening on port ${3000}!`);
});

module.exports = app;
