import jwt from 'jsonwebtoken';
import Place from '../models/placeSchema.js';
import User from '../models/userSchema.js';

const controller = {
    create_place: async (req, res, next) => {
        try {
            // Extraer el token del encabezado
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            // Verificar el token usando el secreto del archivo .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Verificar si el usuario existe
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Crear el lugar sin verificar el rol
            const { name, address, photo, occupancy } = req.body;
            const place = await Place.create({
                name,
                address,
                photo,
                date: [],
                occupancy
            });

            return res.status(201).json({
                success: true,
                message: 'Place created successfully',
                place
            });
        } catch (error) {
            next(error);
        }
    },

    get_places: async (req, res, next) => {
        try {
            const places = await Place.find();
            return res.status(200).json({
                success: true,
                message: 'Places retrieved successfully',
                places
            });
        } catch (error) {
            next(error);
        }
    }
};

export default controller;