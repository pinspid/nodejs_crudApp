let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let appRouter = require('./routes/router');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/assets', express.static('public'));

app.get('/', (req, res, next) => {
    res.render('home');
})

app.use('/', appRouter);

const server = app.listen(8080,() => {
    console.log(`Server is running on port ${server.address().port}`);    
});