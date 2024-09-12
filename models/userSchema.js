import mongoose from 'mongoose';

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  genre: {
    type: String
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  role: {
    type: String,
    enum: ['admin', 'user', 'organizer'],
    default: 'user'
  }
});

// Crear el modelo 'User'
const User = mongoose.model('User', userSchema);

export default User;