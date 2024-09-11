import userRouter from './users.js'

import express from 'express'
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//rutas de todos los recursos
//a traves del metodo .use() le indico al enrutador principal que use esas rutas con esa palabrita(endpoint)
router.use('/users',userRouter)

export default router
