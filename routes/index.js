import express from 'express';
import passport from '../middlewares/passport.js'; // Ruta a tu configuración de Passport
import userRouter from './users.js';
import placeRouter from './places.js';
import eventRouter from './events.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());
// Configuración de Passport
app.use(passport.initialize());

// Rutas
app.use('/users', userRouter);
app.use('/places', placeRouter);
app.use('/events', eventRouter);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

export default app;
