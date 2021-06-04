const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const multer = require('multer');
const csrf = require('csurf');
const mongoose = require('mongoose');
const session = require('express-session');
const { request, response } = require('express');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

//USE BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//SET UP VIEWS
app.set('view engine', 'ejs');// צד שמאל באיזה מנוע אנחנו רוצים להשתמש ובצד ימין איזה תיקייה או ספריה
app.set('views','views');

//MULTER - PATH - UPLOAD FILES
//1
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {    //פונקצית פרמס שעושה 2 פעולות
        callback(null, 'public/images');
    },
    filename:(request, file, callback) => {
        callback(null, file.originalname);
    }
})
//2
app.use(multer({ storage: fileStorage, limits: {fieldSize: 25033697} }).array('image'));//קובע חוק באתר שכל השדות של התמונות יהיו אימג
app.use(express.static(path.join(__dirname, 'public'))); //איזה תיקייה היא התיקייה הציבורית שפתוחה לתמונות ולמה שצריף
app.use('/images', express.static('images'));


const indexController = require('./controllers/index');
const { runInNewContext } = require('vm');
app.use('/', indexController);

//1 תיצור לי איזשהי הגנה
const csurfProtection = csrf();
//2 תגני כל הזמן
app.use(csurfProtection);
//3 מסבירה לו איך להשתמש 
app.use((request, response, next) => {
    response.locals.csrfToken = request.csrfToken();
    next();
});


const port = 6060;
app.listen(port, function(){
    console.log(`server is running via ${port}`);
});

