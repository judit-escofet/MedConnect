require('dotenv').config(); // 1. Load environment variables
const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // 2. Require mongoose
// Note: We don't need 'uuid' anymore because MongoDB generates unique _id's automatically!

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((error) => console.error('Database connection failed:', error));

// --- MONGOOSE SCHEMA & MODEL ---
const listingSchema = new mongoose.Schema({
  title: String,
  category: String,
  quantity: String,
  expiry: String, // Keeping as String to match your form input structure easily
  condition: String,
  location: String,
  donor: String,
  donorType: String,
  contact: String,
  status: { type: String, default: 'available' },
  urgency: { type: String, default: 'normal' },
  description: String,
  postedAt: { type: Date, default: Date.now }, // Auto-sets the date
  image: { type: String, default: 'default' }
});

const Listing = mongoose.model('Listing', listingSchema);

// In-memory data for users and claims (Good enough for the hackathon MVP!)
let claims = [];
let users = [
  { id: 'u1', name: 'Hope Free Clinic', type: 'ngo', email: 'contact@hopeclinic.org', verified: true, location: 'Newark, NJ' }
];
let currentUser = null; // Session mock


// --- ROUTES ---

app.get('/', async (req, res) => {
  try {
    // Run database queries simultaneously for speed
    const [totalListings, available, claimed, recentListings] = await Promise.all([
      Listing.countDocuments(),
      Listing.countDocuments({ status: 'available' }),
      Listing.countDocuments({ status: 'claimed' }),
      Listing.find().sort({ postedAt: -1 }).limit(4) // Get 4 newest
    ]);

    const stats = { totalListings, available, claimed, partners: 47, itemsRedirected: 12400 };
    res.render('index', { listings: recentListings, stats, user: currentUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("Database error");
  }
});

app.get('/marketplace', async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let dbQuery = {}; // Build our search filter

    if (category && category !== 'all') dbQuery.category = category;
    if (status && status !== 'all') dbQuery.status = status;
    if (search) {
      // Searches title or description (case-insensitive)
      dbQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const filteredListings = await Listing.find(dbQuery).sort({ postedAt: -1 });
    const categories = await Listing.distinct('category'); // Gets all unique categories from DB

    res.render('marketplace', { listings: filteredListings, categories, query: req.query, user: currentUser });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

app.get('/listing/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.redirect('/marketplace');
    res.render('listing', { listing, user: currentUser });
  } catch (error) {
    // If id is invalid format, it will throw an error, so we catch it and redirect
    res.redirect('/marketplace');
  }
});

app.get('/donate', (req, res) => {
  res.render('donate', { user: currentUser, success: null });
});

app.post('/donate', async (req, res) => {
  try {
    // Mongoose creates the _id and sets default status/postedAt automatically!
    await Listing.create(req.body);
    res.render('donate', { user: currentUser, success: true });
  } catch (error) {
    console.error(error);
    res.render('donate', { user: currentUser, success: false });
  }
});

app.post('/claim/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing && listing.status === 'available') {
      // Update DB status
      listing.status = 'claimed';
      await listing.save();

      // Log claim in memory
      claims.push({
        listingId: listing._id,
        claimedBy: req.body.orgName || 'Anonymous NGO',
        claimedAt: new Date(),
        contact: req.body.contact
      });
    }
    res.redirect(`/listing/${req.params.id}?claimed=true`);
  } catch (error) {
    res.redirect('/marketplace');
  }
});

app.get('/dashboard', async (req, res) => {
  try {
    const recentListings = await Listing.find().sort({ postedAt: -1 }).limit(6);
    
    const [available, claimed, highUrgency, uniqueCategories] = await Promise.all([
      Listing.countDocuments({ status: 'available' }),
      Listing.countDocuments({ status: 'claimed' }),
      Listing.countDocuments({ urgency: 'high', status: 'available' }),
      Listing.distinct('category')
    ]);

    const stats = { available, claimed, highUrgency, categories: uniqueCategories.length };

    // MongoDB aggregation to get count of items per category
    const categoryData = await Listing.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    
    // Format for your EJS template expectation: { "PPE": 5, "Medication": 2 }
    const categoryBreakdown = {};
    categoryData.forEach(item => {
      categoryBreakdown[item._id] = item.count;
    });

    res.render('dashboard', { listings: recentListings, stats, categoryBreakdown, user: currentUser });
  } catch (error) {
    res.redirect('/');
  }
});

app.get('/about', (req, res) => {
  res.render('about', { user: currentUser });
});

app.listen(PORT, () => {
  console.log(`MedConnect running at http://localhost:${PORT}`);
});