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

  const API_URL = "https://4a65-2a0b-4140-d5a0-00-2.ngrok-free.app";

  const searchMovies = async () => {
    const searchQuery = query.trim();
    if (!searchQuery) return;

    setIsLoading(true);
    setMovies([]);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/?query=${encodeURIComponent(
          searchQuery
        )}&model_name=all_mpnet_base_v2&top_k=5`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.length === 0) {
        setError(
          'No movies found. Try different keywords like "sci-fi robots" or "romantic comedy"'
        );
      } else {
        const validatedMovies = data.map((movie) => ({
          title: movie.title || "Unknown title",
          genres: movie.genres || [],
          plot: movie.plot || "No description available",
        }));
        console.log(validatedMovies[0].genres);
        setMovies(validatedMovies);
      }
    } catch (err) {
      setError("Search error. Please try again.");
      console.error("Error fetching movies:", err);
    } finally {
      setIsLoading(false);
    }
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
                genres={movie.genres}
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
