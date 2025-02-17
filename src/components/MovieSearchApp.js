import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";

const API_KEY = "943946bf"; // Replace with your OMDb API key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;

//https://www.omdbapi.com/?i=tt3896198&apikey=943946bf
const MovieSearchApp = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const searchMovies = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}${query}`);
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError(data.Error);
        setMovies([]);
      }
    } catch (err) {
      setError("Failed to fetch data.");
    }
    setLoading(false);
  };

  const toggleFavorite = (movie) => {
    let updatedFavorites = [...favorites];
    const isFavorite = favorites.find((fav) => fav.imdbID === movie.imdbID);
    if (isFavorite) {
      updatedFavorites = updatedFavorites.filter((fav) => fav.imdbID !== movie.imdbID);
    } else {
      updatedFavorites.push(movie);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Movie Search App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className="flex-grow p-2 border rounded-l"
        />
        <button onClick={searchMovies} className="bg-blue-500 text-white p-2 rounded-r">
          Search
        </button>
      </div>
      {loading && <Spinner/>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="border p-4 rounded shadow">
            <img src={movie.Poster} alt={movie.Title} className="w-full h-60 object-cover" />
            <h2 className="text-lg font-semibold mt-2">{movie.Title} ({movie.Year})</h2>
            <button
              className={`mt-2 p-2 rounded text-white ${favorites.some((fav) => fav.imdbID === movie.imdbID) ? "bg-red-500" : "bg-green-500"}`}
              onClick={() => toggleFavorite(movie)}
            >
              {favorites.some((fav) => fav.imdbID === movie.imdbID) ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-6">Favorites</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((movie) => (
          <div key={movie.imdbID} className="border p-4 rounded shadow">
            <h2>{movie.Title}</h2>
            <button className="mt-2 bg-red-500 text-white p-2 rounded" onClick={() => toggleFavorite(movie)}>
              Remove from Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSearchApp;
