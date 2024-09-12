import User from '../models/userSchema.js';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

const controller = {

    sign_up: async (req, res, next) => {
        try {
            //hashear la contraseña del usuario
            const hashedPassword = await bcryptjs.hash(req.body.password, 10);

            //crear el usuario en la base de datos con user.create 
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
            })

            return res.status(201).json({
                success : true,
                message: 'User registered successfully',
                user: user
            })

        } catch(error){
            next(error)
        }
        
    },

    sign_in: async (req, res, next) => {
        try {
            //buscar el usuario por su nombre
            const user = await User.findOne({email: req.body.email});

            if(!user){
                return res.status(401).json({
                    success : false,
                    message: 'wrong credentials'
                })
            }

            //comparar las contraseñas
            const isMatch = await bcryptjs.compare(req.body.password, user.password);
            if(!isMatch){
                return res.status(401).json({
                    success : false,
                    message: 'wrong credentials'
                })
            }

            //generar el token
            const token = jsonwebtoken.sign({id: user._id}, process.env.JWT_SECRET, {
                expiresIn: '1d'});
            return res.status(200).json({
                success : true,
                message: 'User logged in successfully',
                token: token
            })

    } catch(error){
        next(error)
    }
    }
};

export default controller;