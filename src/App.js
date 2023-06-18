import React, { useState,useEffect,useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    openingText: "",
    releaseDate: "",
  });
 

 

 const fetchMoviesHandler =   useCallback( async() => {
  setIsLoading(true);
  setError(null)
  try{
     const response = await fetch("https://swapi.dev/api/films/")
       if(!response.ok){
        throw new Error('something went wrong...!')
      }
     
     const data =await response.json()

     
      
        const transformedMovies = data.results.map((movieData) => {
          return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date,
          };
        
        
      });
      setMovies(transformedMovies);
      setIsLoading(false)
      
  }
  catch(error){
     setError(error.message)
     
  }
  setIsLoading(false)
  },[]);
  
   useEffect(()=>{
    fetchMoviesHandler();
  },[fetchMoviesHandler])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const addMovieHandler = (event) => {
    event.preventDefault();
    const {  title, openingText, releaseDate } = formData;
    const newMovie = {
      id: Math.random()*10,
      title: title.trim(),
      openingText: openingText.trim(),
      releaseDate: releaseDate.trim(),
    };
    setMovies((prevMovies) => [...prevMovies, newMovie]);
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
       {!isLoading && movies.length>0 && <MoviesList movies={movies} /> }
       {!isLoading && movies.length===0 && !error && <p>Found no Movies</p>}
      {!isLoading && error && <p>{error}</p>}
       {isLoading && <p>Loading...</p>}
       
      </section>
    </React.Fragment>
  );
}

export default App;
