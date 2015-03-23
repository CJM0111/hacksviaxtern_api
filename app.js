var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer'); 
var handlebars = require('express-handlebars')
        .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(express.static(__dirname + '/static'));

var fortunes = [
        "Conquer your fears or they will conquer you.",
        "Rivers need springs.",
        "Do not fear what you don't know.",
        "You will have a pleasant surprise.",
        "Whenever possible, keep it simple.",
];

app.get('/', function(req, res){
        // res.type('text/plain');
        // res.send('Get a cup of coffee');
        res.render('home');
});

app.get('/about', function(req, res){
        var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        res.render('about', { fortune: randomFortune });
});

app.post('/fortunes', function(req, res){
       f = JSON.parse(JSON.stringify(req.body, null, 2))['fortune'];
       // console.log('adding fortune: ' + f);
       fortunes[fortunes.length] = f;
       res.render('fortunes', { fortunes: fortunes });
});

app.use(function(req, res, next){
        res.status(404);
        res.render('404');
});

app.use(function(err, req, res, next){
        console.error(err.stack);
        res.status(500);
        res.render('500');
});

app.listen(app.get('port'), function(){
        console.log( 'Express started on http://localhost:' +
                     app.get('port') + '; press Ctrl-C to terminate.' );
});
