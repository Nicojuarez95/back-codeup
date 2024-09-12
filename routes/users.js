import express from 'express'
import controller from '../controllers/userControllers.js'

const {sign_up, sign_in} = controller

let router = express.Router();

router.post('/signup', sign_up)
router.post('/signin', sign_in)

export default router