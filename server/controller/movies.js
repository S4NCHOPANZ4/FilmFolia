const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const path = require("path");
const router = express.Router();
const axios = require("axios");
const { promisify } = require("util");
const natural = require("natural");
const { isAuthenticated } = require("../middleware/auth.js");

// create user
router.post(
  "/search-movies",
  catchAsyncErrors(async (req, res, next) => {
    const { search } = req.body;

    const apiKey = process.env.API_KEY;
    const axiosInstance = axios.create({
      baseURL: "https://api.themoviedb.org/3/",
      params: {
        api_key: apiKey,
      },
    });

    const findMostSimilarMovie = async (searchTerm) => {
      try {
        const response = await axiosInstance.get("/search/movie", {
          params: {
            query: searchTerm,
          },
        });

        const userSearch = searchTerm.toLowerCase();
        const movies = response.data.results;

        // Calcular la similitud de nombres de películas utilizando distancia de Levenshtein
        const similarities = movies.map((movie) => {
          const title = movie.title.toLowerCase();
          const distance = natural.LevenshteinDistance(title, userSearch);
          return { movie, distance };
        });

        // Ordenar películas por similitud (menor distancia de Levenshtein primero)
        similarities.sort((a, b) => a.distance - b.distance);
        const top10Similarities = similarities.slice(0, 5);
        res.status(201).json({
          success: true,
          movies: top10Similarities,
        });
      } catch (error) {
        console.error("Error al buscar la película:", error);
       
      }
    };
    findMostSimilarMovie(search);
  })
);

router.get(
  "/search-trending",
  catchAsyncErrors(async (req, res, next) => {
    const apiKey = process.env.API_KEY;
    
    const findTrending = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);

        const movies = response.data.results;
        const top7movies = movies.slice(0, 7);
        res.status(201).json({
          success: true,
          movies: top7movies,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 400));
      }
    };
    findTrending()

  })
);



router.post(
  "/get-movie-id",
  catchAsyncErrors(async (req, res, next) => {
    const apiKey = process.env.API_KEY;
    
    const {movieId} = req.body;

    const findTrending = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);

        const movies = response.data;

        res.status(201).json({
          success: true,
          movies: movies,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 400));
      }
    };
    findTrending()

  })
);


module.exports = router;
