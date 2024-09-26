import jwt from 'jsonwebtoken';
import Event from '../models/eventSchema.js';
import Place from '../models/placeSchema.js';
import User from '../models/userSchema.js';

const controller = {
    create_event: async (req, res, next) => {
        try {
            // Extraer el token del encabezado
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Verificar si el usuario existe
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verificar si el lugar existe y la fecha está disponible
            const { place: placeId, date, name, photo, description, minimumAge } = req.body;
            const place = await Place.findById(placeId);
            if (!place) {
                return res.status(404).json({ message: 'Place not found' });
            }

            // Verificar si la fecha ya está ocupada
            const eventsOnDate = await Event.find({ place: placeId, date });
            if (eventsOnDate.length > 0) {
                return res.status(400).json({ message: 'Date is already booked' });
            }

            // Crear el evento
            const event = await Event.create({
                place: placeId,
                date,
                name,
                photo,
                description,
                minimumAge,
                organizer: userId
            });

            return res.status(201).json({
                success: true,
                message: 'Event created successfully',
                event
            });
        } catch (error) {
            next(error);
        }
    },

    get_event: async (req, res, next) => {
        try {
            const events = await Event.find();
            return res.status(200).json({
                success: true,
                message: 'Events retrieved successfully',
                events
            });
        } catch (error) {
            next(error);
        }
    },

    register_event: async (req, res, next) => {
        try {
            // Obtener el token del encabezado
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Buscar al usuario
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Obtener el ID del evento desde el cuerpo de la solicitud
            const { eventId } = req.body;

            // Buscar el evento
            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            // Verificar la edad del usuario
            if (user.age < event.minimumAge) {
                return res.status(403).json({ message: 'User does not meet the minimum age requirement' });
            }

            // Verificar la disponibilidad de cupos
            if (event.attendees.length >= event.occupancy) {
                return res.status(400).json({ message: 'No available spots for this event' });
            }

            // Agregar al usuario a la lista de asistentes del evento
            event.attendees.push(user._id);
            await event.save();

            // Agregar el evento a la lista de eventos del usuario
            user.events.push(event._id);
            await user.save();

            return res.status(200).json({
                success: true,
                message: 'User registered successfully to the event',
                event
            });
        } catch (error) {
            next(error);
        }
    },
     // Actualizar un evento
     update_event: async (req, res, next) => {
        try {
            // Extraer el token del encabezado
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Buscar el evento
            const { id } = req.params;
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            // Verificar si el usuario es el organizador del evento
            if (event.organizer.toString() !== userId) {
                return res.status(403).json({ message: 'You are not authorized to update this event' });
            }

            // Actualizar el evento
            const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });

            return res.status(200).json({
                success: true,
                message: 'Event updated successfully',
                event: updatedEvent
            });
        } catch (error) {
            next(error);
        }
    },

    getEventById: async (req, res, next) => {
        try {
            // Extraer el token del encabezado
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Buscar el evento
            const { id } = req.params;
            const event = await Event.findById(id).populate('place').populate('organizer');
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            // Puedes agregar lógica adicional si deseas verificar si el usuario tiene permiso para ver el evento
            // Por ejemplo, si solo los organizadores pueden ver sus propios eventos:
            // if (event.organizer.toString() !== userId) {
            //     return res.status(403).json({ message: 'You are not authorized to view this event' });
            // }

            return res.status(200).json({
                success: true,
                message: 'Event retrieved successfully',
                event
            });
        } catch (error) {
            next(error); // Pasa el error al manejador de errores
        }
    },
};

export default controller;