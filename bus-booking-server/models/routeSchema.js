const pool = require('../config/connection');

class Route {
  constructor(pool) {
    this.pool = pool;
  }

  async createRoutesTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS routes (
          id SERIAL PRIMARY KEY,
          src VARCHAR(255) NOT NULL,
          destination VARCHAR(255) NOT NULL,
          distance DECIMAL(10, 2) NOT NULL
        );
      `;
      await this.pool.query(query);
      console.log('routes table created successfully');
    } catch (error) {
      console.error('Error creating routes table:', error);
    }
  }

  async deleteRoutesTable() {
    try {
      const query = 'DROP TABLE IF EXISTS routes';
      await this.pool.query(query);
      console.log('Deleted')
    } catch (error) {
      console.error('Error deleting table ', error)
    }
  }

  async checkSrcToDestinationRoute(src, destination) {
    try {
      const query = `
        SELECT * FROM routes WHERE src = $1 AND destination = $2;
      `;
      const result = await this.pool.query(query, [src, destination]);
      console.log('Route checked successfully');
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error checking src to destination route:', error);
      return null;
    }
  
  }

  async addRoute(src, destination, distance) {
    try {
      const currentRoute = await this.checkSrcToDestinationRoute(src, destination);
      if (currentRoute) {
        console.log('Route already exists');
        return currentRoute;
      }
      const query = `
        INSERT INTO routes (src, destination, distance)
        VALUES ($1, $2, $3) RETURNING *;
      `;
      const result = await this.pool.query(query, [src, destination, distance]);
      console.log("Route is successfully added");
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting route:', error);
      return null;
    }
  }
}

module.exports = Route;
