import userRouter from './users.js'
import placeRouter from './places.js'
import eventRouter from './events.js'
import express from 'express'
let router = express.Router();

router.use('/users',userRouter)
router.use('/places', placeRouter)
router.use('/events',eventRouter)

export default router
