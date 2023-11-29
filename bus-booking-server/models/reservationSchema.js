class Reservation {
  constructor(pool) {
    this.pool = pool;
  }

  async createReservationSchema() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS seat_reservations (
          user_id INT REFERENCES users(id),
          bus_id INT REFERENCES buses(id),
          route_id INT REFERENCES routes(id),
          seat_number INT NOT NULL,
          booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          journey_date DATE NOT NULL,
          PRIMARY KEY (bus_id, seat_number, journey_date)
        );
      `;
      await this.pool.query(query);
      console.log('seat_reservations table created successfully');
    } catch (error) {
      console.error('Error creating seat_reservations table:', error);
    }
  }

  async deleteReservationSchema() {
    try {
      const query = `
      DROP TABLE IF EXISTS seat_reservations;
      `;
      await this.pool.query(query);
    } catch (error) {
      console.error('Error creating seat_reservations table:', error);
    }
  }

  async seatAvailability(id, dateOfJourney) {
    try {
      console.log(id, dateOfJourney)
      const query = `
      WITH AllSeats AS (
        SELECT generate_series(1, (SELECT totalSeats FROM buses WHERE id = $1)) AS seat_number
      ),
      BookedSeats AS (
        SELECT DISTINCT seat_number
        FROM seat_reservations
        WHERE bus_id = $1
          AND journey_date = $2
      )
      
      SELECT seat_number
      FROM AllSeats
      WHERE seat_number NOT IN (SELECT seat_number FROM BookedSeats);      
      `;
      const result = await this.pool.query(query, [id, dateOfJourney]);
      console.log('Seat availability:', result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error checking seat availability:', error);
      return [];
    }
  }

  async bookSeat(bus_id, route_id, seat_number, dateOfJourney, user_id) {
    try{
      const query = `
        INSERT INTO seat_reservations(bus_id, route_id, seat_number, journey_date, user_id) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `;
      const result = await this.pool.query(query, [bus_id, route_id, seat_number, dateOfJourney, user_id]);
      console.log('Seat is booked');
      return result.rows[0];
    } catch(error){
      console.error('Unable to book ticket:', error);
      return error;
    }
  }
}

module.exports = Reservation;
