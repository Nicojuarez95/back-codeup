import express from 'express'
import controller from '../controllers/userControllers.js'
import passport from 'passport';

const {sign_up, sign_in, updateUser, updatePassword, leaveComment, rateEvent} = controller

let router = express.Router();


router.post('/signup', sign_up)
router.post('/signin', sign_in)

// Middleware de autenticación para proteger las rutas
router.use(passport.authenticate('jwt', { session: false }));

router.put('/update', updateUser); // Actualizar datos del usuario
router.put('/update-password', updatePassword); // Actualizar contraseña del usuario
router.post('/event/:id/comment', leaveComment); // Dejar comentario en evento
router.post('/event/:id/rate', rateEvent); // Puntuar evento


export default router