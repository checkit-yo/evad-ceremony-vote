# Evad Ceremony - Voting Platform

A ceremonial voting platform for the Evad Ceremony 2026, built with Nuxt 3, Vue 3, and Tailwind CSS.

## Features

- 🎭 10 award categories with up to 16 nominees each
- 📧 Email-based OTP verification for votes
- 🔒 Server-side API routes (no exposed endpoints)
- 📱 Fully responsive (mobile + desktop)
- 🎨 Elegant, Cannes-style ceremonial design
- 👑 Admin panel for viewing vote results

## Tech Stack

- **Framework**: Nuxt 3 (SSR)
- **Frontend**: Vue 3 + Composition API
- **Styling**: Tailwind CSS v3
- **Fonts**: Montserrat (titles) + The Youngest (body)
- **Colors**: Burgundy (#5d0e16), Gold (#ffcb39), Cream (#e0c8a9), White

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site will be available at `http://localhost:3000`

### Admin Panel

Access the admin panel at `/admin` with the default password: `evad2026`

(Change this in production via the `ADMIN_PASSWORD` environment variable)

## Project Structure

```
evad-ceremony-vote/
├── app.vue                    # App entry
├── nuxt.config.ts             # Nuxt configuration
├── tailwind.config.ts         # Tailwind configuration
├── assets/
│   └── css/
│       └── main.css           # Global styles
├── components/
│   ├── AppHeader.vue          # Navigation header
│   ├── AppFooter.vue          # Footer with credits
│   ├── CategoryCard.vue       # Category preview card
│   ├── NomineeCard.vue        # Nominee card with video
│   ├── NomineeSkeleton.vue    # Loading skeleton
│   └── VoteModal.vue          # Email + OTP voting flow
├── data/
│   └── mock.ts                # Mock data & in-memory storage
├── layouts/
│   └── default.vue            # Default layout
├── pages/
│   ├── index.vue              # Homepage
│   ├── categories/
│   │   └── [slug].vue         # Category detail page
│   └── admin/
│       └── index.vue          # Admin dashboard
├── public/
│   └── fonts/                 # Custom fonts (add The Youngest here)
└── server/
    └── api/
        ├── vote.post.ts       # Initiate vote & send OTP
        ├── verify-otp.post.ts # Verify OTP & record vote
        └── admin/
            └── results.get.ts # Get voting results (protected)
```

## Configuration

### Environment Variables

```env
# Admin password for results access
ADMIN_PASSWORD=your-secure-password
```

### Custom Fonts

To use "The Youngest" font:

1. Add `TheYoungest.woff2` and `TheYoungest.woff` to `/public/fonts/`
2. The CSS is already configured in `main.css`

Or find an alternative similar font from Google Fonts.

## Mock Data

The platform uses mock data for demonstration:

- **Categories**: 10 pre-defined categories
- **Nominees**: 6-16 per category with placeholder images
- **Votes**: Randomly seeded for demo purposes

In production, replace with real database connections.

## Key Dates

- **Voting Opens**: June 7, 2026
- **Ceremony Date**: October 18, 2026

## Customization

### Colors

Edit `tailwind.config.ts` to change the color palette:

```ts
colors: {
  burgundy: { DEFAULT: '#5d0e16', ... },
  gold: { DEFAULT: '#ffcb39', ... },
  cream: { DEFAULT: '#e0c8a9', ... },
}
```

### Categories

Edit `data/mock.ts` to modify categories and nominees.

## Production Deployment

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

For deployment, see [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment).

## Credits

Developed with ❤️ by [Checkit](https://checkit.dance)

---

© 2026 Evad Ceremony. All rights reserved.
