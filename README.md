# Regenerative Farm Finder

A Next.js application that helps users find regenerative farms, farmers markets, and food businesses near them.

## Tech Stack

- **Framework**: Next.js 14.1.0 with TypeScript
- **Database**: MongoDB with Atlas Search
- **Mapping**: Leaflet
- **Styling**: Tailwind CSS

## Core Features

- Geospatial search using zip codes
- Interactive map with farm markers
- Detailed farm listings with practices and contact info
- Distance-based filtering
- Business type filtering (Farm, Grocery, Market, etc)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main landing page
│   └── api/farms/search/     # Farm search endpoint
├── components/
│   ├── Map.tsx              # Leaflet map integration
│   ├── SearchBox.tsx        # Search filters UI
│   └── FarmListing.tsx      # Farm result card
├── models/
│   └── Farm.ts              # MongoDB farm schema
└── lib/
    └── mongodb.ts           # Database connection
```

## Data Model

Farm schema includes:
- Name and description
- Geospatial location (GeoJSON Point)
- Address fields
- Business type (enum)
- Farming practices
- Contact information

## Search Implementation

Uses MongoDB Atlas Search with:
- Geospatial queries via `$search` with `geoWithin`
- Distance calculations in aggregation pipeline
- Custom search index named "Farmsearch"

## API Routes

`GET /api/farms/search`
- Parameters:
  - zipCode (required)
  - radius (default: 50 miles)
  - type (optional business type filter)
- Returns farms with calculated distances

## UI Components

- Responsive grid layout
- Clean search interface
- Interactive map markers
- Detailed farm cards with contact actions