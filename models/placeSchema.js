import mongoose from "mongoose";

let placeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    photo: {
      type: String
    },
    date: [{
      type: mongoose.Schema.Types.ObjectId,  // Usar mongoose.Schema
      ref: 'Event'
    }],
    occupancy: {
      type: Number,
      required: true
    }
  });
  
// Crear el modelo 'Place'
const Place = mongoose.model('Place', placeSchema);

export default Place;
