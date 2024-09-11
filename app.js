import express from "express"              // moodulo para usar todo lo de abajo
import "dotenv/config.js"                  //configuracion del archivo .env
import './config/database.js'             //requiero la configuracion de la db
import path from "path";                   //maneja las rutas
import cookieParser from "cookie-parser";    //libreria para ver sesiones.. no se va  usar
import logger from "morgan"                 //libreria
import indexRouter from './routes/index.js'     //traen las rutas de los enpoints
import cors from 'cors'
import { __dirname } from "./utils.js";

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors());

//app.use para usar middlewares para enrutarme con esas "palabritas"
app.use('/', indexRouter);

export default app
