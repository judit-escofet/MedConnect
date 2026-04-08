# MedConnect — Medical Supply Redistribution Network

> **Hackathon Project | SDG 3.8 | Universal Health Coverage**

MedConnect is a B2B marketplace connecting medical surplus from hospitals, pharmacies, and individuals to verified NGOs and free clinics, at zero cost. 

## Quick Start

To run this project locally, you will need a MongoDB Atlas cluster.

**1. Clone and install dependencies**
```bash
npm install
```

**2. Configure Environment Variables**
Create a `.env` file in the root directory and add your MongoDB connection string:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/medconnect?retryWrites=true&w=majority
PORT=3000
```

**3. Start the server**
```bash
npm start
# Server will run on http://localhost:3000
```

## Project Structure

```text
medconnect/
├── .env                   # Environment variables (Database credentials)
├── .gitignore             # Secures .env and node_modules from being pushed
├── package.json           # App dependencies
├── server.js              # Express app + MongoDB connection + API routes
├── public/                # Static assets
│   └── css/
│       └── style.css      # Full design system
└── views/                 # EJS Templates
    ├── about.ejs          # Mission + SDG alignment
    ├── dashboard.ejs      # Stats + management view
    ├── donate.ejs         # Post new surplus listing
    ├── index.ejs          # Landing page
    ├── listing.ejs        # Individual listing + claim form
    ├── marketplace.ejs    # Browse/filter listings
    └── partials/
        ├── footer.ejs     # Footer
        └── header.ejs     # Nav
```

## SDG Alignment

**SDG 3.8** — Achieve universal health coverage, including access to safe, effective, quality, and affordable essential medicines and vaccines for all.

MedConnect directly addresses:
* **Supply Chain Barriers:** Unlocking resources for under-funded health organizations.
* **Waste Reduction:** Rerouting surplus inventory away from landfills.
* **Capacity Building:** Freeing up NGO budgets to focus on direct patient care.

## Key Features

| Feature | Description |
| :--- | :--- |
| **Marketplace** | Browse surplus by category, location, and urgency. |
| **Donate Flow** | Hospitals, clinics, and individuals can list surplus in under 2 minutes. |
| **Claim System** | NGOs can claim items using an organization verification workflow. |
| **Live Dashboard** | Real-time database metrics on redistribution impact and inventory. |

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose (ODM)
* **Frontend:** EJS (Embedded JavaScript templating), HTML5, CSS3
* **Typography:** DM Serif Display + DM Sans (Google Fonts)

## Future Roadmap (Post-Hackathon)

- [ ] **Authentication:** Secure user accounts via Passport.js or Auth0.
- [ ] **Email Notifications:** Automated claim alerts via Nodemailer or SendGrid.
- [ ] **File Uploads:** Real image hosting for supply listings via Multer + AWS S3.
- [ ] **Geolocation:** Map-based matching to connect local donors with local clinics.
- [ ] **Impact Reporting:** Automated PDF generation for hospital tax write-offs.

## License

MIT — Built for good.
