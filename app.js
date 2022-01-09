const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override");

mongoose
  .connect("mongodb://localhost:27017/YelpCampDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to YelpCampDB");
  })
  .catch((err) => {
    console.log("Error connecting to YelpCampDB");
    console.log(err);
  });

const app = express(); // Create server
app.set("view engine", "ejs"); // Allow use of ejs files
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // Required for something....
// Required for the edit page to make the form use a PUT request
// to update the camp in the database.
app.use(methodOverride("_method"));

// Routes
// Home page
app.get("/", (req, res) => {
  res.render("home");
});

// Shows a list of all campgrounds in the database
// Gets all the campgrounds from database
// Renders the index page with the names of each camp in db
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// Page to create a new campground to add to the database
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// Page where the form from /campgrounds/new is posted too
// Takes the information from form and creates a new campground
// Saves the campground to the database
// Then redirects the user to the show page of that new campground
app.post("/campgrounds", async (req, res) => {
  const newCamp = new Campground(req.body.campground);
  await newCamp.save();
  res.redirect(`/campgrounds/${newCamp._id}`);
});

// Page that shows the details of an individual campground
// Takes the id from the url
// Finds the corresponding campground with the matching id in the database
// Renders the show page with the found campground information
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id);
  res.render("campgrounds/show", { foundCamp });
});

// Page that allows user to edit a campground
// Takes the id from
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const foundCamp = await Campground.findById(id);
  res.render("campgrounds/edit", { foundCamp });
});

// Route for the patch request from ^
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const foundCamp = await Campground.findByIdAndUpdate(
    id,
      { ...req.body.campground },
    { runValidators: true, new: true }
  );
  console.log(req.body.campground);
  res.redirect(`/campgrounds/${foundCamp._id}`);
});

// A route that allows the user to delete a campground
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

// Start up the server on port 3000, when connected notify
app.listen(3000, () => {
  console.log("Server up, on port 3000");
});
