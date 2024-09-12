import express from 'express'
import controller from '../controllers/placeControllers.js'

const {create_place, get_places} = controller

let router = express.Router();

router.post('/create', create_place)
router.get('/getplaces', get_places)

export default router