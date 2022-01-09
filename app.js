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

const app = express();



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({
        title: 'My Backyard',
        description: 'Cheap camping'
    });
    await camp.save();
    res.send(camp);
})

app.listen(3000, () => {
    console.log('Server up, on port 3000');
});