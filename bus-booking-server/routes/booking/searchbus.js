const router = require('express').Router();
const Bus = require('../../models/busSchema');
const pool = require('../../config/connection');


const bus = new Bus(pool);


router.post('/', async (req, res) => {
    try {
        let {src, destination, date} = req.body;
        if(!src || !destination || !date){
            return res.status(400).json({error: 'Missing required parameter'});
        }
        date = new Date(date).toLocaleDateString();
        const buses = await bus.getBusesBySrcAndDestination(src, destination, date);
        res.json(buses);
    } catch (error) {
        console.error('Error retrieving buses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;