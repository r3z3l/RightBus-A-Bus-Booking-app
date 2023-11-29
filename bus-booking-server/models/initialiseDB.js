const pool = require('../config/connection');
const Bus = require('./busSchema');
const Route = require('./routeSchema');
const User = require('./userSchema');
const Reservation = require('./reservationSchema');
const BusUser = require('./busUserSchema');

class DatabaseInitializer {
    constructor(pool) {
        this.pool = pool;
        this.bus = new Bus(pool);
        this.route = new Route(pool);
        this.user = new User(pool);
        this.reservation = new Reservation(pool);
        this.busUser = new BusUser(pool);
    }

    async createTables() {
        // await this.busUser.deleteBuseUserRelationTable();
        // await this.reservation.deleteReservationSchema();
        // await this.bus.deleteBusTable();
        // await this.route.deleteRoutesTable();
        // await this.user.deleteUserTable();
        await this.route.createRoutesTable();
        await this.bus.createBusTable();
        await this.user.createUserTable();
        await this.reservation.createReservationSchema();
        await this.busUser.createBusUserRelationTable();
    }

    async initialise() {
        try {
            await this.createTables();
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
        }
    }
}

const dbInitializer = new DatabaseInitializer(pool);
dbInitializer.initialise();
