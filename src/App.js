import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    openingText: "",
    releaseDate: "",
  });

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://crudcrud.com/api/c317046188f8467c90c17404a703a4b8/movies");
      if (!response.ok) {
        throw new Error("something went wrong...!");
      }

      const data = await response.json();
      console.log(data)
      const transformedMovies = data.map((movieData) => {
        return {
          id: movieData._id,
          title: movieData.title,
          openingText: movieData.openingText,
          releaseDate: movieData.releaseDate,
        };
      });
      setMovies(transformedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const  addMovieHandler = async (event) => {
    event.preventDefault();
    const { title, openingText, releaseDate } = formData;
    const newMovie = {
      
      title: title.trim(),
      openingText: openingText.trim(),
      releaseDate: releaseDate.trim(),
    };
    // setMovies((prevMovies) => [...prevMovies, newMovie]);
   const response = await fetch("https://crudcrud.com/api/c317046188f8467c90c17404a703a4b8/movies",{
      method:'POST',
      body:JSON.stringify(newMovie),
      headers:{
        'Content-Type':'application/json'
      }
    })

    const data = await response.json();
    console.log(data)

    setFormData({
      title: "",
      openingText: "",
      releaseDate: "",
    });
  };

  return (
    <React.Fragment>
      <section>
        <form onSubmit={addMovieHandler}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="openingText">Opening Text:</label>
            <input
              type="text"
              id="openingText"
              name="openingText"
              value={formData.openingText}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="releaseDate">Release Date:</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Add Movie</button>
        </form>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}> Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no Movies</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
