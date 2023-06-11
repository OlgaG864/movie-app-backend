const express = require("express");
const {
  uploadTrailer,
  createMovie,
  updateMovieWithoutPoster,
  updateMovieWithPoster,
  removeMovie,
} = require("../controllers/movie");
const { isAuth, isAdmin } = require("../middleware/auth");
const { uploadVideo, uploadImage } = require("../middleware/multer");
const { validateMovie, validate } = require("../middleware/validator");
const { parseData } = require("../utils/helpers");
const router = express.Router();

router.post(
  "/upload-trailer",
  //isAuth,
  //isAdmin,
  uploadVideo.single("video"),
  uploadTrailer
);
router.post(
  "/create",
  //isAuth,
  //isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  createMovie
);
router.patch(
  "/update-movie-without-poster/:movieId",
  isAuth,
  isAdmin,
  // parseData,
  validateMovie,
  validate,
  updateMovieWithoutPoster
);
router.patch(
  "/update-movie-with-poster/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  updateMovieWithPoster
);
router.delete("/:movieId", isAuth, isAdmin, removeMovie);

module.exports = router;
