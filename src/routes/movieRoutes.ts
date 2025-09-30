import { Router } from "express";

const router = Router();

class Ticket {
  constructor(
    public id: number,
    public type: 'Regular' | 'Premium',
    public price: number,
    public reserved: boolean = false,
    private movieId: number,
    private showTimeId: number
  ) {}

  getReference(): string {
    return `M-${this.movieId}-S-${this.showTimeId}-T-${this.id}`
  }
}

class ShowTime {
  constructor(
    public id: number,
    public date: string,
    public tickets: Ticket[]) {}

  getAvailableSeats() {
    return this.tickets.reduce((counts, ticket) => {
      if (!ticket.reserved) {
        if (ticket.type === 'Regular') counts.regularCount++
        else if (ticket.type === 'Premium') counts.premiumCount ++
      }
      return counts
    }, { regularCount: 0, premiumCount: 0})
  }

    reserve(regularCount: number, premiumCount: number): Ticket[] | null {
    const available = this.getAvailableSeats();
    if (regularCount > available.regularCount || premiumCount > available.premiumCount) {
      return null;
    }

    const reservedTickets: Ticket[] = [];
    let r = 0, p = 0;

    for (const ticket of this.tickets) {
      if (!ticket.reserved) {
        if (ticket.type === 'Regular' && r < regularCount) {
          ticket.reserved = true;
          r++
          reservedTickets.push(ticket)
        } else if (ticket.type === 'Premium' && p < premiumCount) {
          ticket.reserved = true;
          p++
          reservedTickets.push(ticket)
        }
      }
    }
    return reservedTickets;
  }
}

class Movie {
  constructor(
    public id: number,
    public name: string,
    public showTimes: ShowTime[]
  ) {}

  getSchedule() {
    return {
      name: this.name,
      time: this.showTimes.map(st => ({
        time: st.date,
        seatsAvailable: st.getAvailableSeats()
      }))
    };
  }
}

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


router.get("/", (req, res) => {
  res.status(200).json(moviesData.map(m => ({ id: m.id, name: m.name })));
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    const movie = moviesData.find(m => m.id === Number(id));

    if (movie) {
      res.status(200).json(movie.getSchedule());
    } else {
      res.status(404).json(`Movie with ID ${id} Not found`);
  }
});


router.post("/reserve", (req, res) => {
  const { movieName, date, regularCount, premiumCount } = req.body;

  const movie = moviesData.find(m => m.name === movieName);
  if (!movie) {
    res.status(404).json({ message: `Movie ${movieName} not found.` });
    return
  }

  const showTime = movie.showTimes.find(st => st.date === date);
  if (!showTime) {
    res.status(404).json({ message: `Show time for ${date} not found.` });
    return
  }

  const reservedTickets = showTime.reserve(regularCount, premiumCount);

  if (reservedTickets) {
    res.status(200).json({
      message: 'Reservation successful',
      ticketReferences: reservedTickets.map(t => t.getReference()),
    });
  } else {
    res.status(400).json({ message: 'Not enough tickets available.' });
  }
});

export default router;
