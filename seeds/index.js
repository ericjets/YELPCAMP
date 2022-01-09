const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

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


const randomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++){
        let randomNumber = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[randomNumber].city}, ${cities[randomNumber].state}`,
            title: `${randomElement(descriptors)} ${randomElement(places)}`
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});