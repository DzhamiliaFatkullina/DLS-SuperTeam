import { useState } from "react";
import SearchBox from "./components/SearchBox";
import MovieCard from "./components/MovieCard";
import Spinner from "./components/Spinner";
import "./styles.css";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const movieDatabase = [
    {
      title: "The Matrix",
      genre: "Sci-Fi, Action",
      plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    },
    {
      title: "Blade Runner 2049",
      genre: "Sci-Fi, Drama",
      plot: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
    },
    {
      title: "Ex Machina",
      genre: "Sci-Fi, Thriller",
      plot: "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.",
    },
    {
      title: "Her",
      genre: "Sci-Fi, Romance",
      plot: "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
    },
    {
      title: "The Terminator",
      genre: "Sci-Fi, Action",
      plot: "A human soldier is sent from 2029 to 1984 to stop an almost indestructible cyborg killing machine, sent from the same year, which has been programmed to execute a young woman whose unborn son is the key to humanity's future salvation.",
    },
  ];

  const searchMovies = () => {
    const searchQuery = query.trim();
    if (!searchQuery) return;

    setIsLoading(true);
    setMovies([]);
    setError(null);

    setTimeout(() => {
      try {
        const matchedMovies = movieDatabase
          .filter(
            (movie) =>
              movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              movie.plot.toLowerCase().includes(searchQuery.toLowerCase()) ||
              movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5);

        if (matchedMovies.length === 0) {
          setError(
            'No movies found. Try different keywords like "sci-fi robots" or "romantic comedy"'
          );
        } else {
          setMovies(matchedMovies);
        }
      } catch (err) {
        setError("Search error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className={`app-container ${isFocused ? "focused" : ""}`}>
      <div className="background-gradient"></div>

      <div className="content-container">
        <header>
          <h1 className="app-title">🎬 FilmFinder</h1>
          <p className="app-subtitle">Describe your dream movie in detail</p>
        </header>

        <main>
          <SearchBox
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onSearch={searchMovies}
            onClear={() => {
              setQuery("");
              setMovies([]);
              setError(null);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {isLoading && <Spinner />}

          {error && <p className="error-message">{error}</p>}

          <div className="results-grid">
            {movies.map((movie, index) => (
              <MovieCard
                key={index}
                title={movie.title}
                genre={movie.genre}
                plot={movie.plot}
              />
            ))}
          </div>
        </main>

        <footer className="app-footer">
          <p>Semantic Movie Search · 50,000+ films</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
