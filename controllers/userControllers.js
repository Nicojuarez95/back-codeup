import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/userSchema.js';
import Event from '../models/eventSchema.js';

const controller = {

    sign_up: async (req, res, next) => {
        try {
             // Verifica si el correo electrónico ya está en uso
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico ya está registrado. Por favor, elige otro.'
                });
            }
            const hashedPassword = await bcryptjs.hash(req.body.password, 10);

            const user = await User.create({
                name: req.body.name,
                lastname: req.body.lastname,
                photo: req.body.photo,
                email: req.body.email,
                password: hashedPassword,
                age: req.body.age,
                genre: req.body.genre,
                events: req.body.events,
                role: req.body.role
            });

            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: user
            });

        } catch (error) {
            next(error);
        }
    },

    sign_in: async (req, res, next) => {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Wrong credentials'
                });
            }

            const isMatch = await bcryptjs.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Wrong credentials'
                });
            }

            const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });

            return res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                token: token,
                user
            });

        } catch (error) {
            next(error);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const { name, lastname, photo } = req.body;
            const user = await User.findByIdAndUpdate(req.user.id, { name, lastname, photo }, { new: true });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            next(error);
        }
    },

    updatePassword: async (req, res, next) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const isMatch = await bcryptjs.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Old password is incorrect'
                });
            }

            user.password = await bcryptjs.hash(newPassword, 10);
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    leaveComment: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { comment } = req.body;
            const event = await Event.findById(id);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            if (event.date > new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot comment on future events'
                });
            }

            event.comments.push({ user: req.user.id, comment });
            await event.save();

            res.status(200).json({
                success: true,
                message: 'Comment added successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    rateEvent: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { rating } = req.body;
            const event = await Event.findById(id);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            if (event.date > new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot rate future events'
                });
            }

            if (!event.attendees.includes(req.user.id)) {
                return res.status(400).json({
                    success: false,
                    message: 'You must attend the event to rate it'
                });
            }

            event.ratings.push({ user: req.user.id, rating });
            await event.save();

            res.status(200).json({
                success: true,
                message: 'Rating added successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};

export default controller;
