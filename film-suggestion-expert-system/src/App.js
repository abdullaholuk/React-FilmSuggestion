import React from "react";
import "./App.css";
import { Col, Row, Select, Button, notification } from "antd";
import CustomSelect from "./components/CustomSelect";
import _ from "underscore";
import ListView from "./components/ListView";

const Option = Select.Option;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedContentRating: "",
      selectedGenres: [],
      selectedDirectors: [],
      selectedActors: [],
      suggestByContentRating: [],
      suggestByGenres: [],
      suggestByDirectors: [],
      suggestByActors: [],
      selectAllGenres: false,
      selectAllDirectors: false,
      selectAllActors: false,
      applicationSuccessRate: 0,
      rateTotal: 0,
      rateCount: 0
    };
  }

  onRateChange = value => {
    this.setState({
      rateCount: this.state.rateCount + 1,
      rateTotal: this.state.rateTotal + value
    });
  };

  openSuccesNotification = () => {
    const rate = ((this.state.rateTotal / this.state.rateCount) * 100) / 5;
    notification.open({
      message: "Succes Rate",
      description: rate
        ? "Total succes rate of system is " + rate + "%"
        : "Not rated yet!"
    });
  };

  // Updates suggestable movies when every filter change
  updateSuggestableMovies = att => {
    var suggestableMovies = [];
    if (att === "ContentRating") {
      this.props.movies.forEach(movie => {
        if (movie.content_rating === this.state.selectedContentRating)
          suggestableMovies.push(movie);
      });
    } else if (att === "Genre") {
      const selectedGenres = this.state.selectedGenres;
      this.state.suggestByContentRating.forEach(movie => {
        var i = 0;
        var flag = 0;
        while (i < selectedGenres.length && !flag) {
          if (movie.genres.includes(selectedGenres[i])) flag = 1;
          i++;
        }
        if (flag) suggestableMovies.push(movie);
      });
    } else if (att === "Director") {
      const selectedDirectors = this.state.selectedDirectors;
      this.state.suggestByGenres.forEach(movie => {
        var i = 0;
        var flag = 0;
        while (i < selectedDirectors.length && !flag) {
          if (movie.director_name === selectedDirectors[i]) flag = 1;
          i++;
        }
        if (flag) suggestableMovies.push(movie);
      });
    } else if (att === "Actor") {
      const selectedActors = this.state.selectedActors;
      this.state.suggestByDirectors.forEach(movie => {
        var i = 0;
        var flag = 0;
        while (i < selectedActors.length && !flag) {
          if (
            movie.actor_1_name === selectedActors[i] ||
            movie.actor_2_name === selectedActors[i] ||
            movie.actor_3_name === selectedActors[i]
          )
            flag = 1;
          i++;
        }
        if (flag) suggestableMovies.push(movie);
      });
    }

    return suggestableMovies;
  };

  getContentRatingOptions = () => {
    return this.props.contentRatings.map(element => {
      return <Option key={element}>{element}</Option>;
    });
  };

  onContentRatingChange = value => {
    this.setState(
      {
        selectedContentRating: value,
        selectedGenres: [],
        selectedDirectors: [],
        selectedActors: [],

        suggestByGenres: [],
        suggestByDirectors: [],
        suggestByActors: [],

        selectAllGenres: false,
        selectAllDirectors: false,
        selectAllActors: false
      },
      () =>
        this.setState({
          suggestByContentRating: this.updateSuggestableMovies("ContentRating")
        })
    );
  };

  getGenreOptions = () => {
    const movies = this.state.suggestByContentRating;
    var genreOptions = [];
    this.props.genres.forEach(genre => {
      var flag = 0;
      var i = 0;
      while (i < movies.length && !flag) {
        if (movies[i].genres.includes(genre)) flag = 1;
        i++;
      }
      if (flag) genreOptions.push(genre);
    });

    genreOptions.sort((a, b) => a < b);

    genreOptions.push("---Select All---");
    genreOptions.reverse();

    return genreOptions;
  };

  renderGenreOptions = () => {
    const genreOptions = this.getGenreOptions();
    return genreOptions.map(element => {
      return <Option key={element}>{element}</Option>;
    });
  };

  onGenreOptionsChange = value => {
    if (value.includes("---Select All---")) {
      this.setState(
        {
          selectedGenres: _.without(this.getGenreOptions(), "---Select All---"),
          selectAllGenres: true
        },
        () =>
          this.setState({
            suggestByGenres: this.updateSuggestableMovies("Genre")
          })
      );
    } else {
      this.setState(
        {
          selectedGenres: value,
          selectAllGenres: false
        },
        () =>
          this.setState({
            suggestByGenres: this.updateSuggestableMovies("Genre")
          })
      );
    }
    this.setState({
      selectedDirectors: [],
      selectedActors: [],

      suggestByDirectors: [],
      suggestByActors: [],

      selectAllDirectors: false,
      selectAllActors: false
    });
  };

  getDirectorOptions = () => {
    const movies = this.state.suggestByGenres;
    var directorOptions = [];
    this.props.directors.forEach(director => {
      var flag = 0;
      var i = 0;
      while (i < movies.length && !flag) {
        if (movies[i].director_name === director) flag = 1;
        i++;
      }
      if (flag) directorOptions.push(director);
    });
    directorOptions.sort((a, b) => a < b);

    directorOptions.push("---Select All---");
    directorOptions.reverse();

    return directorOptions;
  };

  renderDirectorOptions = () => {
    const directorOptions = this.getDirectorOptions();
    return directorOptions.map(element => {
      return <Option key={element}>{element}</Option>;
    });
  };

  onDirectorOptionsChange = value => {
    if (value.includes("---Select All---")) {
      this.setState(
        {
          selectedDirectors: _.without(
            this.getDirectorOptions(),
            "---Select All---"
          ),
          selectAllDirectors: true
        },
        () =>
          this.setState({
            suggestByDirectors: this.updateSuggestableMovies("Director")
          })
      );
    } else {
      this.setState(
        {
          selectedDirectors: value,
          selectAllDirectors: false
        },
        () =>
          this.setState({
            suggestByDirectors: this.updateSuggestableMovies("Director")
          })
      );
    }
    this.setState({
      selectedActors: [],
      selectAllActors: false,

      suggestByActors: []
    });
  };

  getActorOptions = () => {
    const movies = this.state.suggestByDirectors;
    var actorOptions = [];
    this.props.actors.forEach(actor => {
      var flag = 0;
      var i = 0;
      while (i < movies.length && !flag) {
        if (
          movies[i].actor_1_name === actor ||
          movies[i].actor_2_name === actor ||
          movies[i].actor_3_name === actor
        )
          flag = 1;
        i++;
      }
      if (flag) actorOptions.push(actor);
    });
    actorOptions.sort((a, b) => a < b);

    actorOptions.push("---Select All---");
    actorOptions.reverse();

    return actorOptions;
  };

  renderActorOptions = () => {
    const actorOptions = this.getActorOptions();
    return actorOptions.map(element => {
      return <Option key={element}>{element}</Option>;
    });
  };

  onActorOptionsChange = value => {
    if (value.includes("---Select All---")) {
      this.setState(
        {
          selectedActors: _.without(this.getActorOptions(), "---Select All---"),
          selectAllActors: true
        },
        () =>
          this.setState({
            suggestByActors: this.updateSuggestableMovies("Actor")
          })
      );
    } else {
      this.setState(
        {
          selectedActors: value,
          selectAllActors: false
        },
        () =>
          this.setState({
            suggestByActors: this.updateSuggestableMovies("Actor")
          })
      );
    }
  };

  render() {
    return (
      <div className = "mainPage">
        <Row>
          <Row>
            <Col md={4} xl={4}>
              <Button
                style={{ margin: "52px", marginBottom: "0px" }}
                onClick={this.openSuccesNotification}
              >
                {" "}
                Show System Succes{" "}
              </Button>
            </Col>
            <Col md={4} xl={4}>
              <CustomSelect
                onChange={this.onContentRatingChange}
                value={this.state.selectedContentRating}
                placeholder={"Select a content rating"}
                title={"Content Rating"}
              >
                {this.getContentRatingOptions()}
              </CustomSelect>
            </Col>
            {this.state.selectedContentRating && (
              <Col md={4} xl={4}>
                <CustomSelect
                  mode="multiple"
                  onChange={this.onGenreOptionsChange}
                  allowClear={true}
                  value={this.state.selectedGenres}
                  selectAll={this.state.selectAllGenres}
                  placeholder={"Select genres"}
                  title={"Genres"}
                >
                  {this.renderGenreOptions()}
                </CustomSelect>
              </Col>
            )}
            {this.state.selectedGenres.length > 0 && (
              <Col md={4} xl={4}>
                <CustomSelect
                  mode="multiple"
                  onChange={this.onDirectorOptionsChange}
                  allowClear={true}
                  value={this.state.selectedDirectors}
                  selectAll={this.state.selectAllDirectors}
                  placeholder={"Select directors"}
                  title={"Directors"}
                >
                  {this.renderDirectorOptions()}
                </CustomSelect>
              </Col>
            )}
            {this.state.selectedDirectors.length > 0 && (
              <Col md={4} xl={4}>
                <CustomSelect
                  mode="multiple"
                  onChange={this.onActorOptionsChange}
                  allowClear={true}
                  value={this.state.selectedActors}
                  selectAll={this.state.selectAllActors}
                  placeholder={"Select actors"}
                  title={"Actors"}
                >
                  {this.renderActorOptions()}
                </CustomSelect>
              </Col>
            )}
          </Row>
          {this.state.suggestByActors.length > 0 && (
            <div>
              <br />
              <Row>
                <Col offset={4} md={16}>
                  <ListView
                    movies={this.state.suggestByActors}
                    onRateChange={this.onRateChange}
                  />
                </Col>
              </Row>
            </div>
          )}
        </Row>
      </div>
    );
  }
}

export default App;
