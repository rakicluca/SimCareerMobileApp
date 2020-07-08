const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set("json spaces", 2);

//"routing" per le varie richieste
const utentiRoutes = require('./api/routes/utenti');
const autoRoutes = require('./api/routes/auto');
const campionatiRoutes = require('./api/routes/campionati');
const circuitiRoutes = require('./api/routes/circuiti');
const classificheRoutes = require('./api/routes/classifiche');
const teamRoutes = require('./api/routes/team');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/utenti', utentiRoutes);
app.use('/auto', autoRoutes);
app.use('/campionati', campionatiRoutes);
app.use('/circuiti', circuitiRoutes);
app.use('/classifiche', classificheRoutes);
app.use('/team', teamRoutes);
//app.use('/')

app.use('/',express.static('public'));

app.get('/', (req, res) => {
  res.send("<h1>SimCarrer API</h1>");
});

module.exports = app;
