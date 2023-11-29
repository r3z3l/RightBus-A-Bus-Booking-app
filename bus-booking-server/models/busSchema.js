const pool = require('../config/connection');
const { updateUserBuses } = require('./busUserSchema');

class Bus {
  constructor(pool) {
    this.pool = pool;
  }

  async createBusTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS buses (
          id SERIAL PRIMARY KEY,
          bus_name VARCHAR(255) NOT NULL,
          route_id INT REFERENCES routes(id),
          occupancy VARCHAR(50) NOT NULL,
          totalSeats INT NOT NULL,
          day_of_working VARCHAR[] NOT NULL
        );
      `;
      await this.pool.query(query);
      console.log('Bus table created successfully');
    } catch (error) {
      console.error('Error creating bus table:', error);
    }
  }

  async deleteBusTable() {
    try {
      const query = `
      DROP TABLE IF EXISTS buses;
      `;
      await this.pool.query(query);
      console.log('Deleted ')
    } catch (error) {
      console.error('Error deleting table ', error)
    }
  }

  async addBus(userId, bus) {
    try {
      const { name, bus_route_id, occupancy, total_seats, day_of_working } = bus;
      const query = `
        INSERT INTO buses (bus_name, route_id, occupancy, totalSeats, day_of_working)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `;
      const result = await this.pool.query(query, [name, bus_route_id, occupancy, total_seats, day_of_working]);
      console.log('Bus added successfully');
      return result.rows[0];
    } catch (error) {
      console.error('Error adding bus:', error);
      return false;
    }
  }

  async getAllBuses() {
    try {
      const query = 'SELECT buses.id as id,buses.bus_name,routes.id as route_id, routes.src, routes.destination, buses.occupancy, buses.totalSeats, buses.day_of_working FROM buses JOIN routes ON buses.route_id = routes.id;';
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching all buses:', error);
      return [];
    }
  }

  async getBusById(id) {
    try {
      const query = 'SELECT * FROM buses WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching bus by ID:', error);
      return null;
    }
  }

  async updateBus(bus) {
    try {
      const { id, busName, route_id, occupancy, totalSeats, day_of_working } = bus;
      const query = `
        UPDATE buses
        SET bus_name = $1, route_id = $2, occupancy = $3, totalSeats = $4, day_of_working = $5
        WHERE id = $6
      `;
      await this.pool.query(query, [busName, route_id, occupancy, totalSeats, day_of_working, id]);
      console.log('Bus updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating bus:', error);
      return false;
    }
  }

  async deleteBusById(busId, userId) {
    try {
      // Begin the transaction
      await this.pool.query('BEGIN');

      // Delete records from bus_user_relation where bus_id matches $1
      await this.pool.query('DELETE FROM bus_user_relation WHERE bus_id = $1 AND user_id = $2', [busId, userId]);

      // Delete the bus from the buses table where id matches $1
      await this.pool.query('DELETE FROM buses WHERE id = $1', [busId]);

      // Commit the transaction (if everything succeeds)
      await this.pool.query('COMMIT');
      console.log('Bus deleted successfully');
      return true;
    } catch (error) {
      await this.pool.query('ROLLBACK');
      console.error('Error deleting bus:');
      return false;
    }
  }

  async getBusesBySrcAndDestination(src, destination, date) {
    try{
      let currentDate = new Date(date);
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      console.log(dayOfWeek)
      currentDate = currentDate.toLocaleDateString();
      const query = `
      SELECT b.*,
      b.totalSeats - COALESCE(COUNT(sr.seat_number), 0) AS available_seats, r.src, r.destination, $4 AS date
      FROM buses b
      JOIN routes r ON b.route_id = r.id
      LEFT JOIN seat_reservations sr ON b.id = sr.bus_id AND sr.journey_date = $4
      WHERE r.src = $1
      AND r.destination = $2
      AND b.day_of_working @> ARRAY[$3]::VARCHAR[]
      GROUP BY b.id,r.src,r.destination,sr.journey_date;
      `;
      const result = await this.pool.query(query, [src, destination, dayOfWeek, currentDate]);
      console.log(`Buses from ${src} to ${destination} on ${currentDate} successfully fetched`);
      return result.rows || [];
    } catch(error) {
      console.error('Error fetching buses:', error);
      return [];
    }
  }
}

module.exports = Bus;
