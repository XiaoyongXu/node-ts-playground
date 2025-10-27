export class Ticket {
  constructor(
    public id: number,
    public type: "Regular" | "Premium",
    public price: number,
    public reserved: boolean = false,
    private movieId: number,
    private showTimeId: number
  ) {}

  getReference(): string {
    return `M-${this.movieId}-S-${this.showTimeId}-T-${this.id}`;
  }
}

export class ShowTime {
  constructor(
    public id: number,
    public date: string,
    public tickets: Ticket[]
  ) {}

  getAvailableSeats() {
    return this.tickets.reduce(
      (counts, ticket) => {
        if (!ticket.reserved) {
          if (ticket.type === "Regular") counts.regularCount++;
          else if (ticket.type === "Premium") counts.premiumCount++;
        }
        return counts;
      },
      { regularCount: 0, premiumCount: 0 }
    );
  }

  reserve(regularCount: number, premiumCount: number): Ticket[] | null {
    const available = this.getAvailableSeats();
    if (
      regularCount > available.regularCount ||
      premiumCount > available.premiumCount
    ) {
      return null;
    }

    const reservedTickets: Ticket[] = [];
    let r = 0,
      p = 0;

    for (const ticket of this.tickets) {
      if (!ticket.reserved) {
        if (ticket.type === "Regular" && r < regularCount) {
          ticket.reserved = true;
          r++;
          reservedTickets.push(ticket);
        } else if (ticket.type === "Premium" && p < premiumCount) {
          ticket.reserved = true;
          p++;
          reservedTickets.push(ticket);
        }
      }
    }
    return reservedTickets;
  }
}

export class Movie {
  constructor(
    public id: number,
    public name: string,
    public showTimes: ShowTime[]
  ) {}

  getSchedule() {
    return {
      name: this.name,
      time: this.showTimes.map((st) => ({
        time: st.date,
        seatsAvailable: st.getAvailableSeats(),
      })),
    };
  }
}
// recipe program

export class Product {
  constructor(
    public id: number,
    public name: string,
    public quantity: number,
    public unit: string,
    public price: number
  ) {}
}

export class Recipe {
  constructor(
    public id: number,
    public name: string,
    public ingredients: {
      name: string;
      quantity: number;
      unit: string;
    }[]
  ) {}
}

export class ShoppingCart {
  constructor(
    public id: number,
    public email: string,
    public products: Product[]
  ) {}
  getTotalPrice() {
    return this.products.reduce((acc, curr) => {
      return (acc += curr.price);
    }, 0);
  }
}


export class Message {
  constructor(
    public id: number,
    public msg: string,
    public senderId: number,
    public receiverId: number,
    public status: 'unread' | 'read'
  ) {}
}

export class User {
  constructor(
    public id: number,
    public name: string,
    public friendIds: number[]
  ) {
  }
}


export interface WarrantyRule {
    product_type: string,
    product_price_range: number[],
    warranty_length: number,
    warranty_price: number,
}

const rules: WarrantyRule[] = [
  {
    product_type: 'mobile phone',
    product_price_range: [0,300],
    warranty_length: 6,
    warranty_price: 2,
  },
  {
    product_type: 'mobile phone',
    product_price_range: [300,1000],
    warranty_length: 6,
    warranty_price: 3,
  },
  {
    product_type: 'mobile phone',
    product_price_range: [300,1000],
    warranty_length: 12,
    warranty_price: 5,
  },
  {
    product_type: 'TV',
    product_price_range: [0,500],
    warranty_length: 12,
    warranty_price: 2.5,
  },
  {
    product_type: 'TV',
    product_price_range: [500,1000],
    warranty_length: 12,
    warranty_price: 4.5,
  },
]


const getPrice = (input: { product_type: any; product_price: any; warranty_length: any; }): number => {
  const {product_type,  product_price, warranty_length} = input
  if (!product_type || !product_price || !warranty_length ) {
    throw new Error('input missing valid field')
  }
  const result = rules.filter((rule: { product_type: any; product_price_range: number[]; warranty_length: any; }) => {
    return rule.product_type === product_type
    && rule.product_price_range[0] <= product_price
    && rule.product_price_range[1] > product_price
    && rule.warranty_length === warranty_length
  })[0]

  if (!result) {
    throw new Error('no rules found')
  }
  return result.warranty_price
}
