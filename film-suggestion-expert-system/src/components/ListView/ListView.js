import React from "react";
import { List, Icon, Tooltip, Rate } from "antd";
import { ListViewContainer } from "./ListView.styled";

const IconText = ({ type, text, title }) => {
  if (!text) return null;
  return (
    <Tooltip placement="top" title={title}>
      <span>
        <Icon type={type} style={{ marginRight: 8 }} theme="filled"/>
        {text}
      </span>
    </Tooltip>
  );
};

class ListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listData: []
    };
  }

  // Works when components first mount
  componentDidMount() {
    this.props.movies.forEach(movie => {
      fetch(
        "http://www.omdbapi.com/?i=tt3896198&apikey=972a462d&t=" +
          movie.movie_title
      )
        .then(response => response.json())
        .then(json => {
          const obj = {
            href: movie.movie_imdb_link,
            title: movie.movie_title,
            country: movie.country,
            facebookLikes: movie.movie_facebook_likes,
            language: movie.language,
            reviewNumber:
              parseInt(movie.num_user_for_reviews) +
              parseInt(movie.num_critic_for_reviews),
            year: movie.title_year,
            plotKeywords: movie.plot_keywords,
            duration: movie.duration,
            color: movie.color,
            director: movie.director,
            actors: [
              movie.actor_1_name,
              movie.actor_2_name,
              movie.actor_3_name
            ],
            genres: movie.genres,
            plot: json.Plot,
            poster: json.Poster,
            imdbScore: json.imdbRating,
            imdbVotes : json.imdbVotes
          };
          this.setState({
            listData: this.state.listData
              .concat(obj)
              .sort((a, b) => a.imdbScore < b.imdbScore)
          });
        });
    });
  }

  // Renders every suggestable films
  renderListItem = movie => {
    return (
      <List.Item
        key={movie.title}
        actions={[
          <IconText
            type="star"
            text={movie.imdbScore}
            title={"IMDB score"}
          />,
          <IconText
            type="eye"
            text={movie.imdbVotes}
            title={"Total IMDB votes"}
          />,
          <IconText
            type="facebook"
            text={movie.facebookLikes}
            title={"Total Facebook likes"}
          />,
          <IconText
            type="message"
            text={movie.reviewNumber}
            title={"Number of reviews"}
          />,
          <IconText
            type="clock-circle"
            text={movie.duration + " mins"}
            title={"Duration"}
          />,

          <Tooltip placement="top" title="Give a rate for this suggestion">
            <span>
              <Rate onChange={this.props.onRateChange} />
            </span>
          </Tooltip>
        ]}
        extra={
          <img
            name="poster"
            width={128}
            height={192}
            alt="logo"
            src={movie.poster}
          />
        }
      >
        <List.Item.Meta
          title={
            <a target="_blank" rel="noopener noreferrer" href={movie.href}>
              {movie.title + "(" + movie.year + ")"}
            </a>
          }
          description={
            "Genres: " + movie.genres + " Keywords: " + movie.plotKeywords
          }
        />
        {movie.plot}
      </List.Item>
    );
  };

  render() {
    return (
      <ListViewContainer>
        <List
          itemLayout="vertical"
          dataSource={this.state.listData}
          renderItem={movie => this.renderListItem(movie)}
          bordered={true}
        />
      </ListViewContainer>
    );
  }
}

export default ListView;
