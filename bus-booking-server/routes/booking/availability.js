const express = require('express');
const fetchUser = require('../../middleware/fetchUser');
const Reservation = require('../../models/reservationSchema');
const Bus = require('../../models/busSchema');
const pool = require('../../config/connection');

const router = express.Router();
const reservation = new Reservation(pool);
const bus = new Bus(pool);


const checkIfBusIsAvailableThatDay = async (busId, date) => {
  try{
    // Format the date to get the day of the week
    const bookingDayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  
    const currentBus = await bus.getBusById(busId);
    if (!currentBus) {
      return false;
    }
    return currentBus.day_of_working.includes(bookingDayOfWeek.toString().toLowerCase());
  } catch(error){
    console.error('Unable to find bus availability on that day', error);
    return false;
  }
};

router.get('/', fetchUser, async (req, res) => {
  try {
    const id = req.query.id;
    let date = req.query.date;
    console.log("DATE:",date)
    console.log("ID:",id)

    if (!date) {
      return res.status(400).json({ error: 'Missing date parameter' });
    }

    date = new Date(date);
    console.log("NEW_DATE:",date)
    const available_day = await checkIfBusIsAvailableThatDay(id, date);
    // console.log(available_day)
    if(!available_day){
      return res.status(404).json({ error : 'Bus not available this day'})
    }

    const availability = await reservation.seatAvailability(id, date);
    let transformedData = {
      seat_number: availability.map(item => item.seat_number)
    };
  
    res.json(transformedData);
  } catch (error) {
    console.error('Error checking seat availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
