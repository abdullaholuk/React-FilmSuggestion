import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "antd/dist/antd.css";

import * as d3 from "d3";
import movie_metadata from "./movie_metadata-10.csv";

import _ from "underscore";

var movies = [];

// Gets unique film attiributes for filter
const getUniqueFilmAttiributes = att => {
  var atts = [];

  if (att === "genres" || att === "plot_keywords") {
    movies.forEach(element => {
      const str = element[att].split("|");
      str.forEach(s => atts.push(s));
    });
  } else {
    movies.forEach(element => {
      atts.push(element[att]);
    });
  }

  atts = _.uniq(atts);

  atts = _.without(atts, "");

  return atts;
};

// D3 framework usage for csv parse
d3.csv(movie_metadata)
  .then(function(data) {
    data.forEach(element => {
      movies.push(element);
    });
  })
  .catch(function(err) {
    throw err;
  })
  .then(() => {
    const contentRatings = getUniqueFilmAttiributes("content_rating");
    const directors = getUniqueFilmAttiributes("director_name");
    const actors = getUniqueFilmAttiributes("actor_1_name");
    actors.push(getUniqueFilmAttiributes("actor_2_name"));
    actors.push(getUniqueFilmAttiributes("actor_3_name"));
    const genres = getUniqueFilmAttiributes("genres");

    // Application start point
    ReactDOM.render(
      <App
        movies={movies}
        contentRatings={contentRatings}
        directors={directors}
        actors={actors}
        genres={genres}
      />,
      document.getElementById("root")
    );
  });
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
