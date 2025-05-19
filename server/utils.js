const getResponseFromOpenAi = require("./openAiRequest.js");

const buildPrompt = (allMovies, cachedMovies) => {
  const prompt = `Here is my complete movie list: ${allMovies}. These are the movies I've recently watched: ${cachedMovies}.
   Based on the genres of the recently watched movies, please recommend 5 movies from the complete list that are similar in genre.
   Ensure that none of the recommended movies are among the recently watched movies. it is for a program, so i need the movies
  in the following format: 
  'movie1', 'movie2', 'movie3', 'movie4', 'movie5', do not wrap it with double quotes`;

  return prompt;
};

const getCachedTitles = (idArray, movies) => {
  const cachedmovies = movies.filter((movie) => idArray.includes(movie.id));
  return cachedmovies.map((movie) => movie.title);
};

const getRecommendedMovies = async (idArray, movies) => {
  const movieTitleArray = movies.map((movie) => movie.title);
  const cachedMovies = movies.filter((movie) => idArray.includes(movie.id));
  const cachedTitles = cachedMovies.map((movie) => movie.title);
  const prompt = buildPrompt(movieTitleArray, cachedTitles);
  answer = await getResponseFromOpenAi(prompt);
  const recommendedMovies = extractMoviesFromAnswer(answer, movies);
  return recommendedMovies;
};

const extractMoviesFromAnswer = (answer, movies) => {
  answer = answer.trim();

  if (answer.startsWith('"') && answer.endsWith('"')) {
    answer = answer.slice(1, -1);
  }

  const titleList = answer.split(",").map((title) => {
    title = title.trim();
    if (title.startsWith("'") && title.endsWith("'")) {
      title = title.slice(1, -1);
    }
    return title;
  });

  return movies.filter((movie) => titleList.includes(movie.title));
};

module.exports = {
  getRecommendedMovies,
  extractMoviesFromAnswer,
  getCachedTitles,
};
