import express from 'express'
import User from '../models/User.js'
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Aca se ven los usuarios');
});

router.post(//metodo para crear usuarios
    '/',
    async (req,res)=>{
        try{
            let user = await User.create(req.body)
            return res.json({
                success: true,
                user: user,
                id: user._id
            })
        } catch(error){
            console.log(error)
            return res.json({
                success: false,
                messagge: "no se pudo crear el usuario"
        })
    }
    }
)

// module.exports = router;
export default router