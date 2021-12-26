import * as express from "express";
import * as path from "path";
import * as routes from "./routes";
import * as cors from "cors";
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')

import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
let myEnv = dotenv.config({path: __dirname + '/config.env'});
// dotenv.config({path: __dirname + '/config-example.env'});
// console.log( __dirname + '/config.env');
console.log( __dirname + '/config-example.env');
dotenvExpand(myEnv);
// dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;

// Configure Express to use EJS
// app.set( "views", path.join( __dirname, "views" ) );
// app.set( "view engine", "ejs" );

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json())

// app.use(fileUpload())

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(cors());


// app.get("/", (reg, res) => {
//     // res.send(
//     //     "Hello World"
//     // )
//
//     res.render("index");
// });

app.use(express.static('public'));

// Configure session auth
// sessionAuth.register( app );

// Configure routes
routes.register( app );


// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
