require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

const Car = require('./models/car');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);
});

// ===== ROUTES =====

// Landing page
app.get('/', (req, res) => {
  res.render('landingpage.ejs');
});

// INDEX - Show all cars
app.get('/cars', async (req, res) => {
  const allCars = await Car.find();
  res.render('cars/index.ejs', { cars: allCars });
});

// NEW - Show form to create new car
app.get('/cars/new', (req, res) => {
  res.render('cars/new.ejs');
});

// CREATE - Add new car to DB
app.post('/cars', async (req, res) => {
  req.body.isElectric = req.body.isElectric === 'on';
  await Car.create(req.body);
  res.redirect('/cars');
});

// SHOW - Show details of one car
app.get('/cars/:carId', async (req, res) => {
  const foundCar = await Car.findById(req.params.carId);
  res.render('cars/show.ejs', { car: foundCar });
});

// EDIT - Show edit form
app.get('/cars/:carId/edit', async (req, res) => {
  const foundCar = await Car.findById(req.params.carId);
  res.render('cars/edit.ejs', { car: foundCar });
});

// UPDATE - Update car in DB
app.put('/cars/:carId', async (req, res) => {
  req.body.isElectric = req.body.isElectric === 'on';
  await Car.findByIdAndUpdate(req.params.carId, req.body);
  res.redirect(`/cars/${req.params.carId}`);
});

// DELETE - Remove car from DB
app.delete('/cars/:carId', async (req, res) => {
  await Car.findByIdAndDelete(req.params.carId);
  res.redirect('/cars');
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
