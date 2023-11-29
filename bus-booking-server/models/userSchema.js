const pool = require('../config/connection');

class User {
  constructor(pool) {
    this.pool = pool;
  }

  async createUserTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(15) NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'user'
        );
      `;
      await this.pool.query(query);
      console.log('users table created successfully');
    } catch (error) {
      console.error('Error creating users table:', error);
    }
  }

  async deleteUserTable() {
    try {
      const query = 'DROP TABLE IF EXISTS users';
      await this.pool.query(query);
      console.log('users table dropped successfully');
    } catch (error) {
      console.error('Error dropping users table:', error);
    }
  }

  async createUser(user) {
    try {
      const { name, email, phone, hashedPassword, role = 'user' } = user;
      const query = `
        INSERT INTO users (name, email, phone, password, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const result = await this.pool.query(query, [name, email, phone, hashedPassword, role]);
      console.log('User created successfully');
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  async extractBookingDetails(userId) {
    try {
      const query = `
        SELECT sr.*, b.*, r.*
        FROM seat_reservations sr
        JOIN buses b ON sr.bus_id = b.id
        JOIN routes r ON sr.route_id = r.id
        WHERE sr.user_id = $1;
      `;
      const result = await this.pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error extracting booking details:', error);
      return [];
    }
  }

  async getUserByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await this.pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  async getUserById(id) {
    try{
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await this.pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
  }
}

module.exports = User;
