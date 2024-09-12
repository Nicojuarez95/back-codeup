import Event from '../models/eventSchema.js'
import Place from '../models/placeSchema.js'

const controller = {

    create_event : async (req, res, next) => {
        try {
            const { place: placeId, date, name, photo, description, attendees, minimumAge, organizer } = req.body;
    
            // Verificar si el lugar existe
            const place = await Place.findById(placeId);
            if (!place) {
                return res.status(404).json({
                    success: false,
                    message: 'Place not found'
                });
            }
    
            // Verificar si la fecha ya está ocupada en el mismo lugar
            const existingEvent = await Event.findOne({ place: placeId, date });
            if (existingEvent) {
                return res.status(400).json({
                    success: false,
                    message: 'The date is already taken for this place'
                });
            }
    
            // Verificar que el organizador existe y es el usuario que creó el lugar
            const user = await User.findById(organizer);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Organizer not found'
                });
            }
    
            // Crear el nuevo evento
            const event = await Event.create({
                place: placeId,
                date,
                name,
                photo,
                description,
                attendees,
                minimumAge,
                organizer
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
            if (req.query.name) {
                filter.name = new RegExp(req.query.name, 'i')
            }
            const events = await Event.find()
            if(events){
            return res.status(200).json({
                success : true,
                message: 'Events retrieved successfully',
                events: events
            })
        }
        }catch(error){
            next(error)
        }
    }

}

export default controller