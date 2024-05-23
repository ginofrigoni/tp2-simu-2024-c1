import express from "express";
import {
  getAllMovies,
  getMovieById,
  getAwardWinningMovies,
  getMoviesByLanguage,
  getMoviesByFreshScore,
  getAllUsers,
  getAllComments,
  getCommentsByUserId,

} from "../data/movies.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getAllMovies(pageSize, page));
});

router.get("/users", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getAllUsers(pageSize, page));
});

router.get("/comments", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getAllComments(pageSize, page));
});

// Nueva ruta para obtener comentarios por user_id
router.get("/user/:userId/comments", async (req, res) => {
  const userId = req.params.userId;

  try {
    const comments = await getCommentsByUserId(userId);
    if (comments.length > 0) {
      res.json(comments);
    } else {
      res.status(404).json({ message: "No comments found for this user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Ruta para obtener películas con premios
router.get("/award", async (req, res) => {
  console.log("aca tá");
  try {
    const movies = await getAwardWinningMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/language/:language", async (req, res) => {
  //  const { language } = req.params;
  const language = req.params.language;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  try {
    const movies = await getMoviesByLanguage(language, pageSize, page);
    res.json(movies);
  } catch (error) {
    console.error("Error al obtener películas por idioma:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/fresh", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  try {
    const movies = await getMoviesByFreshScore(pageSize, page);
    res.json(movies);
  } catch (error) {
    console.error(
      "Error al obtener películas ordenadas por puntaje 'fresh':",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
});


// Nueva ruta para obtener una película por _id
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const movie = await getMovieById(id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
