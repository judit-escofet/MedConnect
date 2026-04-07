# MedConnect — Medical Supply Redistribution Network

> **Hackathon Project | SDG 3.8 | Universal Health Coverage**

MedConnect is a B2B marketplace connecting medical surplus from hospitals, pharmacies, and individuals to verified NGOs and free clinics, at zero cost.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
http://localhost:3000
```

##  Project Structure

```
medconnect/
├── server.js              # Express app + routes + in-memory data
├── views/
│   ├── index.ejs          # Landing page
│   ├── marketplace.ejs    # Browse/filter listings
│   ├── listing.ejs        # Individual listing + claim form
│   ├── donate.ejs         # Post new surplus listing
│   ├── dashboard.ejs      # Stats + management view
│   ├── about.ejs          # Mission + SDG alignment
│   └── partials/
│       ├── header.ejs     # Nav
│       └── footer.ejs     # Footer
├── public/
│   └── css/
│       └── style.css      # Full design system
└── package.json
```

## SDG Alignment

**SDG 3.8** — Achieve universal health coverage, including access to safe, effective, quality, and affordable essential medicines and vaccines for all.

MedConnect directly addresses:
- Supply chain barriers for under-resourced health organizations
- Medical waste from surplus inventory
- Budget constraints limiting NGO patient care capacity

## Key Features

| Feature | Description |
|---|---|
|  Marketplace | Browse surplus by category, location, urgency |
|  Donate Flow | Hospitals/clinics/individuals list surplus in 2 mins |
|  Claim System | NGOs claim items with org verification |
|  Dashboard | Live stats on redistribution impact |
|  Verification | Donor + recipient verification model |

##  Tech Stack

- **Backend**: Node.js + Express
- **Templating**: EJS
- **Storage**: In-memory (swap for MongoDB/PostgreSQL in production)
- **Fonts**: DM Serif Display + DM Sans (Google Fonts)

##  Production Additions (Post-Hackathon)

- [ ] Database (MongoDB or PostgreSQL)
- [ ] Authentication (Passport.js / Auth0)
- [ ] Email notifications (Nodemailer / SendGrid)
- [ ] File uploads for supply images (Multer + S3)
- [ ] NGO verification workflow
- [ ] Geolocation-based matching
- [ ] Impact tracking & reporting

##  License

MIT — Built for good.
