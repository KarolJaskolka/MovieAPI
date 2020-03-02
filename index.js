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

// Cross-origin resource sharing (Allow different ports)
const cors = require('cors');
const corsOptions = { origin: 'http://localhost:4200' } // my angular app address
app.use(cors(corsOptions));

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
const commentRoutes = require('./api/routes/comment');
const ratingRoutes = require('./api/routes/rating');
const authRoutes = require('./api/routes/auth');
const updateRoutes = require('./api/routes/update');app.use('/api/', updateRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/auth', authRoutes);

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