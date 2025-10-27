import { Ticket, ShowTime, Movie } from '../models/classes'
import { Request, Response, NextFunction } from 'express';

const createTickets = (startId: number, movieId: number, showTimeId: number): Ticket[] => [
  new Ticket(startId, 'Regular', 10, false, movieId, showTimeId),
  new Ticket(startId + 1, 'Premium', 20, false, movieId, showTimeId),
];

const showTimesData: ShowTime[] = [
  new ShowTime(1, '2025-09-29', createTickets(1, 1, 1)),
  new ShowTime(2, '2025-09-30', createTickets(3, 1, 2)),
  new ShowTime(3, '2025-10-01', createTickets(5, 2, 3)),
  new ShowTime(4, '2025-10-02', createTickets(7, 2, 4)),
];

export const moviesData: Movie[] = [
  new Movie(1, 'movie 1', [showTimesData[0], showTimesData[1]]),
  new Movie(2, 'movie 2', [showTimesData[2], showTimesData[3]]),
];

export const getMovies = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(moviesData.map((m) => ({ id: m.id, name: m.name })));
  } catch(error) {
    next(error)
  }
}

export const getMovieById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const movie = moviesData.find((m) => m.id === Number(id));

    if (movie) {
      res.status(200).json(movie.getSchedule());
    } else {
      res.status(404).json(`Movie with ID ${id} Not found`);
    }

  } catch(error) {
    next(error)
  }
}

export const reserveTickets = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { movieName, date, regularCount, premiumCount } = req.body;

    const movie = moviesData.find((m) => m.name === movieName);
    if (!movie) {
      res.status(404).json({ message: `Movie ${movieName} not found.` });
    }

    const showTime = movie?.showTimes.find((st) => st.date === date);
    if (!showTime) {
      res.status(404).json({ message: `Show time for ${date} not found.` });
    }

    const reservedTickets = showTime?.reserve(regularCount, premiumCount);

    if (reservedTickets) {
      res.status(200).json({
        message: "Reservation successful",
        ticketReferences: reservedTickets.map((t) => t.getReference()),
      });
    } else {
      res.status(400).json({ message: "Not enough tickets available." });
    }
  } catch (error) {
    next(error);
  }
}
