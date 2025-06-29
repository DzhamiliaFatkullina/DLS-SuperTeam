const MovieCard = ({ title, genre, plot, year, rating }) => {
  const generatePoster = (title) => {
    const colors = ['#FF6B6B', '#48DBFB', '#6BCB77', '#FAA2C1', '#FFD166'];
    const color = colors[title.length % colors.length];
    return (
      <div className="movie-poster" style={{ backgroundColor: color }}>
        {title.split(' ').map(word => word[0]).join('').slice(0, 3)}
      </div>
    );
  };

  return (
    <article className="movie-card">
      <div className="movie-poster-container">
        {generatePoster(title)}
      </div>
      
      <div className="movie-content">
        <div className="movie-header">
          <h3>{title}</h3>
        </div>
        
        <div className="genre-tags">
          {genre.split(', ').map((g, i) => (
            <span key={i} className="genre-tag">{g.trim()}</span>
          ))}
        </div>
        
        <p className="movie-plot">{plot}</p>
      </div>
    </article>
  );
};

export default MovieCard;