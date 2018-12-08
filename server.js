var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const express = require('express')
const app = express()

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

require('./data/reddit-db.js');

const post = require('./controllers/posts.js');
const comment = require('./controllers/comments.js');

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

module.exports = app

post(app)
comment(app)

app.listen(process.env.PORT || '3000', () => {
    console.log(`App listening on port 3000!`)
})
