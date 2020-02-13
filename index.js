const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, ()=>{
    console.log(`Server is listening on ${host}:${port}`)
});

const Sequelize = require('sequelize');
// Option 1: Passing parameters separately
const sequelize = new Sequelize(process.env.DATABASE, process.env.LOGIN, process.env.PASS, {
  host: process.env.HOST,
  dialect: 'postgres'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Prevent multiple requests
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // max 100 requests
});
 
app.use(limiter);

// Add some security
const helmet = require('helmet');
app.use(helmet());

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Print useful info about request
app.use((req, res, next)=>{
    console.log(req.ip, req.method, req.path, new Date());
    next();
})

// Routes
const movieRoutes = require('./api/routes/movie');
const userRoutes = require('./api/routes/user');

app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);

// Serve static files 
app.use('/api/images', express.static('./api/images'));

// Handle errors
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.send(err.message);
});