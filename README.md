# IDX Exchange — Property Listing Platform

A full-stack real estate property listing application built with React, Express.js, and MySQL. Search, filter, paginate, and explore properties with detailed information, image galleries, an interactive map, and open house schedules. Users can also save favorite properties, persisted locally in the browser.

## Quick Start

### Prerequisites
- Node.js 16+
- npm 8+
- Docker Desktop (used to run MySQL locally)
- Git
- A Google Maps API key (for property location maps)

### Setup (10 minutes)

**1. Clone the repository**
```bash
git clone https://github.com/sbambenek/IDX-Exchange-SDE-Summer-2026.git
cd IDX-Exchange-SDE-Summer-2026
```

**2. Start MySQL via Docker**
```bash
docker run --name idx-mysql-local -e MYSQL_ROOT_PASSWORD=yourpassword -p 3306:3306 -d mysql:8
```
Then load the schema and data (`rets_property.sql` and `rets_openhouse.sql`) into a database named `rets`.

**3. Backend setup**
```bash
cd backend
npm install
```
Create `backend/.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=rets
PORT=5001
```
```bash
npm run dev     # runs on http://localhost:5001
```

**4. Frontend setup** (new terminal)
```bash
cd frontend
npm install
```
Create `frontend/.env`:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```
```bash
npm start       # runs on http://localhost:3000
```

Visit `http://localhost:3000` in your browser.

## Features
- 🔍 **Search & Filter** — city, zip, price range, beds, baths
- 📄 **Pagination** — hybrid page-number layout with ellipsis for large result sets
- 🖼️ **Image Gallery & Carousel** — full-screen lightbox with keyboard navigation on the detail page, inline carousel on listing cards
- 🗺️ **Maps** — Google Maps Embed API showing property location with a directions link
- 🏠 **Open Houses** — displays scheduled open house dates, times, and remarks
- ❤️ **Favorites** — save/unsave properties via a custom `useFavorites` hook, persisted in localStorage across a shared React Context
- ⚠️ **Error Handling** — backend validation with proper HTTP status codes, React Error Boundary for graceful frontend recovery

## Project Structure
backend/
├── db.js # MySQL connection pool
├── app.js # Express app + middleware (logging, CORS)
├── routes/
│ └── properties.js # /api/properties endpoints + validation
└── package.json

frontend/
└── src/
├── api/ # API client functions
├── components/ # Reusable UI components
├── pages/ # Route-level page components
├── hooks/ # Custom hooks (useFavorites / FavoritesContext)
├── utils/ # Shared formatting helpers
└── App.js # Router + nav

.github/
└── pull_request_template.md

## Testing & Code Quality
```bash
# Frontend
cd frontend
npm test              # Jest + React Testing Library, with coverage
npm run lint           # ESLint check

# Backend
cd backend
npm test               # Jest + Supertest, mocked DB pool
npx jest --coverage    # Coverage report
```
**Coverage:** Backend routes at 82%+ line coverage.

## Git Workflow
```bash
git checkout develop
git checkout -b feature/feature-name
# ...make changes...
git commit -m "feat(scope): description"
git checkout develop
git merge feature/feature-name
git push origin develop
```

**Conventional commit types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

## API Reference

### `GET /api/health`
Checks server and database connectivity.
```json
{ "status": "ok", "database": "connected" }
```

### `GET /api/properties`
Paginated, filterable list of properties.

**Query params:** `city`, `zipcode`, `minPrice`, `maxPrice`, `beds`, `baths`, `limit` (default 20), `offset` (default 0)

GET /api/properties?city=Beverly Hills&minPrice=1000000&beds=3&limit=20&offset=0

```json
{ "total": 287, "limit": 20, "offset": 0, "results": [ { "L_ListingID": "1118422731", "L_Address": "1461 Laurel Way", "L_SystemPrice": 3950000 } ] }
```

### `GET /api/properties/:id`
Full details for a single property. Returns `200`, `404` (not found), or `400` (malformed ID).

### `GET /api/properties/:id/openhouses`
Open house events for a property, ordered by date/time. Returns `200` (array, empty if none), `404`, or `400`.

## Database Schema

**`rets_property`** — main listings table
- `L_ListingID` — unique listing identifier
- `L_City`, `L_State`, `L_Zip`, `L_Address` — location fields
- `L_SystemPrice` — listing price
- `L_Keyword2` — bedroom count
- `LM_Dec_3` — bathroom count
- `L_Photos` — JSON array of photo URLs (stored as text, parsed client-side)
- `LMD_MP_Latitude` / `LMD_MP_Longitude` — map coordinates

**`rets_openhouse`** — open house events, linked via `L_ListingID`
- `OpenHouseDate`, `OH_StartTime`, `OH_EndTime`
- `all_data` — JSON blob containing additional fields, including `OpenHouseRemarks`

> Column names follow the source RETS feed's internal naming, not standard MLS field names (e.g. `L_Keyword2` for bedrooms).

## Architecture Highlights

**Request flow:**

React Component → API Client → CRA Proxy → Express Server
↓ (validation & parameterized query building)
MySQL Database → JSON Response → React State → Re-render

**Key design decisions:**
- **Request deduplication (`useRef`)** in `ListingsPage` — prevents stale, out-of-order async responses from overwriting newer filter/page results
- **Shared Favorites state via React Context** — avoids each component holding its own disconnected `useState`, so the nav badge, cards, and Favorites page all stay in sync
- **Parameterized SQL queries throughout** — no string concatenation, preventing SQL injection
- **Composite + single-column indexes** on frequently filtered columns (city, price, beds, baths), verified with `EXPLAIN`
- **Defensive JSON parsing** — `L_Photos` and `all_data` are parsed inside `try/catch` blocks client-side, since not all rows contain valid JSON

## Known Issues & Future Improvements
- Some photo URLs in the source dataset are broken/expired (data issue, not app logic)
- Sorting is not yet implemented
- No user authentication — favorites are per-browser (localStorage), not tied to an account
- No full-text address/keyword search

## Technology Stack
| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 19 |
| Routing | React Router | 6 |
| Backend | Express | 5 |
| Database | MySQL | 8 (Docker) |
| Testing | Jest + Supertest / React Testing Library | — |
| Maps | Google Maps Embed API | — |

## Status
- ✅ Core search, filter, pagination, detail pages, maps, open houses, favorites
- ✅ Backend test coverage 82%+
- ✅ ESLint passing with no errors
- Last updated: 2026-09-08