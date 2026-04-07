const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory data store (replace with DB in production)
let listings = [
  {
    id: uuidv4(),
    title: 'Unopened Surgical Gloves (Nitrile)',
    category: 'PPE',
    quantity: '500 pairs',
    expiry: '2026-08-15',
    condition: 'Sealed/Unused',
    location: 'Newark, NJ',
    donor: 'St. Mary\'s Clinic',
    donorType: 'clinic',
    contact: 'supplies@stmarys.org',
    status: 'available',
    urgency: 'normal',
    description: 'Full boxes of size M and L nitrile surgical gloves. Excess from overstock order.',
    postedAt: new Date('2025-03-15'),
    image: 'gloves'
  },
  {
    id: uuidv4(),
    title: 'Portable Blood Pressure Monitors',
    category: 'Equipment',
    quantity: '8 units',
    expiry: null,
    condition: 'Lightly Used',
    location: 'Brooklyn, NY',
    donor: 'WellCare Pharmacy',
    donorType: 'pharmacy',
    contact: 'wellcare@pharma.com',
    status: 'available',
    urgency: 'normal',
    description: 'Omron Series 7 monitors, all tested and working. Replacing with newer models.',
    postedAt: new Date('2025-03-20'),
    image: 'monitor'
  },
  {
    id: uuidv4(),
    title: 'Amoxicillin 500mg (Sealed)',
    category: 'Medication',
    quantity: '200 tablets',
    expiry: '2026-12-01',
    condition: 'Sealed/Unused',
    location: 'Manhattan, NY',
    donor: 'Anonymous Donor',
    donorType: 'individual',
    contact: 'via platform',
    status: 'available',
    urgency: 'high',
    description: 'Factory sealed, full bottles. Donated by patient who no longer needs them after treatment change.',
    postedAt: new Date('2025-03-22'),
    image: 'medication'
  },
  {
    id: uuidv4(),
    title: 'Wound Care Dressing Kit',
    category: 'Supplies',
    quantity: '120 kits',
    expiry: '2027-03-10',
    condition: 'Sealed/Unused',
    location: 'Jersey City, NJ',
    donor: 'Riverside Medical Center',
    donorType: 'hospital',
    contact: 'logistics@riverside.org',
    status: 'claimed',
    urgency: 'normal',
    description: 'Advanced wound dressing kits with antiseptic, gauze, and adhesive bandages.',
    postedAt: new Date('2025-03-10'),
    image: 'wound'
  },
  {
    id: uuidv4(),
    title: 'Digital Thermometers (Infrared)',
    category: 'Equipment',
    quantity: '25 units',
    expiry: null,
    condition: 'Like New',
    location: 'Queens, NY',
    donor: 'Healthy Start Clinic',
    donorType: 'clinic',
    contact: 'admin@healthystart.org',
    status: 'available',
    urgency: 'normal',
    description: 'Non-contact infrared thermometers. Used briefly during COVID screening, now surplus.',
    postedAt: new Date('2025-03-25'),
    image: 'thermometer'
  },
  {
    id: uuidv4(),
    title: 'IV Infusion Sets (Sterile)',
    category: 'Supplies',
    quantity: '300 sets',
    expiry: '2026-05-20',
    condition: 'Sealed/Unused',
    location: 'Philadelphia, PA',
    donor: 'Jefferson University Hospital',
    donorType: 'hospital',
    contact: 'medops@jefferson.edu',
    status: 'available',
    urgency: 'high',
    description: 'Standard IV infusion sets. Department upgraded to new protocol, excess stock available.',
    postedAt: new Date('2025-03-28'),
    image: 'iv'
  }
];

let claims = [];
let users = [
  { id: 'u1', name: 'Hope Free Clinic', type: 'ngo', email: 'contact@hopeclinic.org', verified: true, location: 'Newark, NJ' },
  { id: 'u2', name: 'Community Health NGO', type: 'ngo', email: 'info@communityhealth.org', verified: true, location: 'Brooklyn, NY' }
];

// Session mock (use express-session in production)
let currentUser = null;

// Routes
app.get('/', (req, res) => {
  const stats = {
    totalListings: listings.length,
    available: listings.filter(l => l.status === 'available').length,
    claimed: listings.filter(l => l.status === 'claimed').length,
    partners: 47,
    itemsRedirected: 12400
  };
  res.render('index', { listings: listings.slice(0, 4), stats, user: currentUser });
});

app.get('/marketplace', (req, res) => {
  const { category, search, status } = req.query;
  let filtered = [...listings];
  if (category && category !== 'all') filtered = filtered.filter(l => l.category === category);
  if (status && status !== 'all') filtered = filtered.filter(l => l.status === status);
  if (search) filtered = filtered.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.description.toLowerCase().includes(search.toLowerCase())
  );
  const categories = [...new Set(listings.map(l => l.category))];
  res.render('marketplace', { listings: filtered, categories, query: req.query, user: currentUser });
});

app.get('/listing/:id', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) return res.redirect('/marketplace');
  res.render('listing', { listing, user: currentUser });
});

app.get('/donate', (req, res) => {
  res.render('donate', { user: currentUser, success: null });
});

app.post('/donate', (req, res) => {
  const { title, category, quantity, expiry, condition, location, donor, donorType, contact, description, urgency } = req.body;
  const newListing = {
    id: uuidv4(),
    title, category, quantity,
    expiry: expiry || null,
    condition, location, donor, donorType, contact, description,
    urgency: urgency || 'normal',
    status: 'available',
    postedAt: new Date(),
    image: 'default'
  };
  listings.unshift(newListing);
  res.render('donate', { user: currentUser, success: true });
});

app.post('/claim/:id', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (listing && listing.status === 'available') {
    listing.status = 'claimed';
    claims.push({
      id: uuidv4(),
      listingId: listing.id,
      claimedBy: req.body.orgName || 'Anonymous NGO',
      claimedAt: new Date(),
      contact: req.body.contact
    });
  }
  res.redirect(`/listing/${req.params.id}?claimed=true`);
});

app.get('/dashboard', (req, res) => {
  const recentListings = listings.slice(0, 6);
  const stats = {
    available: listings.filter(l => l.status === 'available').length,
    claimed: listings.filter(l => l.status === 'claimed').length,
    highUrgency: listings.filter(l => l.urgency === 'high' && l.status === 'available').length,
    categories: [...new Set(listings.map(l => l.category))].length
  };
  const categoryBreakdown = {};
  listings.forEach(l => {
    categoryBreakdown[l.category] = (categoryBreakdown[l.category] || 0) + 1;
  });
  res.render('dashboard', { listings: recentListings, stats, categoryBreakdown, user: currentUser });
});

app.get('/about', (req, res) => {
  res.render('about', { user: currentUser });
});

app.listen(PORT, () => {
  console.log(`MedConnect running at http://localhost:${PORT}`);
});
