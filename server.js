let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
let methodOverride = require('method-override');
let appRouter = require('./routes/router');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/assets', express.static('public'));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'crudapp',
    resave: false,
    saveUninitialized: true,
    cookie: {  secure: false }
}));
app.use(require('./middleware/flash'));

app.use('/', appRouter);

app.get('/', (req, res, next) => {
    res.render('home');
});


const server = app.listen(8080,() => {
    console.log(`Server is running on port ${server.address().port}`);    
});