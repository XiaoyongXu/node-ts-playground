import { Router, Request, Response } from "express";
import { moviesData, getMovies, getMovieById, reserveTickets } from '../controllers/movieController';

const router = Router();

router.get("/", getMovies);

router.get("/:id", getMovieById);

router.post("/reserve", reserveTickets);

export default router;
