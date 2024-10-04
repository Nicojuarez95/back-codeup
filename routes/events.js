import express from 'express'
import controller from '../controllers/eventControllers.js'


const {create_event, get_event, register_event, update_event, getEventById, getEventsByOrganizer} = controller

let router = express.Router();

router.post('/createevent', create_event)
router.get('/getevent', get_event)
router.post('/register', register_event);
router.put('/update/:id', update_event);
router.get('/event/:id', getEventById);
router.get('/organizer', getEventsByOrganizer);

export default router