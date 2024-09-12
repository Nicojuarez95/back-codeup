import express from 'express'
import controller from '../controllers/eventControllers.js'


const {create_event, get_event, register_event} = controller

let router = express.Router();

router.post('/createevent', create_event)
router.get('/getevent', get_event)
router.post('/register', register_event);

export default router