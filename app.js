const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/YelpCampDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to YelpCampDB');
    })
    .catch((err) => {
        console.log('Error connecting to YelpCampDB');
        console.log(err);
    });

const app = express(); // Create server
app.set('view engine', 'ejs'); // Allow use of ejs files
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // Required for something....


// Routes
// Home page
app.get('/', (req, res) => {
    res.render('home');
});

// Shows a list of all campgrounds in the database
// Gets all the campgrounds from database
// Renders the index page with the names of each camp in db
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

// Page to create a new campground to add to the database
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// Page where the form from /campgrounds/new is posted too
// Takes the information from form and creates a new campground
// Saves the campground to the database
// Then redirects the user to the show page of that new campground
app.post('/campgrounds', async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
});

// Page that shows the details of an individual campground
// Takes the id from the url
// Finds the corresponding campground with the matching id in the database
// Renders the show page with the found campground information 
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/show', { foundCamp });
});

// Start up the server on port 3000, when connected notify
app.listen(3000, () => {
    console.log('Server up, on port 3000');
});