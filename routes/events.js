import express from 'express'
import controller from '../controllers/eventControllers.js'


const {create_event, get_event, register_event, update_event, getEventById} = controller

let router = express.Router();

router.post('/createevent', create_event)
router.get('/getevent', get_event)
router.post('/register', register_event);
router.put('/update/:id', update_event);
router.get('/event/:id', getEventById);

export default router