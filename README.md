# ⚔️ Phalcon Gear Tracker 2.0

**Phalcon Gear Tracker 2.0** is a full-stack application designed to track and compare World of Warcraft character gear against *Best-in-Slot (BiS)* lists from Maxroll.  
It allows players to visualize their equipment, identify missing or non-optimal pieces, and stay updated with the latest BiS recommendations — all in a fast, Dockerized, and modular architecture.

---

## 🧩 Project Overview

This project is built with a **Node.js + Express** backend and a **React + Tailwind** frontend, connected through REST APIs.  
Data persistence is managed via **PostgreSQL**, with **Prisma ORM** for schema and migration management.  
Both frontend and backend run as Docker containers for consistent development and deployment.

---

## 🏗️ Tech Stack

| Layer | Technology | Description |
|:------|:------------|:------------|
| **Backend** | Node.js + Express | REST API with clean modular routing |
| | Prisma ORM | PostgreSQL schema & migration management |
| | Axios | API consumption (Maxroll & Blizzard endpoints) |
| | TypeScript | Strict typing and modern JS support |
| | Docker | Containerized environment |
| **Frontend** | React + Next.js (App Router) | SPA with SSR support |
| | TailwindCSS | Utility-first responsive styling |
| | ShadCN/UI + Lucide | Component system and icons |
| | Context + Custom Hooks | Centralized state (gear tracker, theme, hydration, etc.) |
| **Database** | PostgreSQL | Persistent storage for gear, characters, and cache |
| **Other** | ESLint + Prettier | Linting and formatting consistency |

---

## 🧱 Architecture

```
root/
├── backend/
│   ├── src/
│   │   ├── app.ts               # Express initialization
│   │   ├── routes/
│   │   │   ├── character.ts     # Endpoints for character data
│   │   │   ├── comparison.ts    # BiS comparison logic
│   │   ├── prisma/
│   │   │   └── schema.prisma    # DB model definitions
│   │   ├── lib/
│   │   │   ├── blizzard.ts      # API integration layer
│   │   │   ├── maxroll.ts       # Maxroll BiS fetching logic
│   │   │   └── cache.ts         # Local caching and TTL
│   │   └── utils/
│   │       └── logger.ts
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Global layout + theme provider
│   │   ├── page.tsx             # Root page
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── HydrationProvider.tsx
│   │   │   └── GearComparisonCard.tsx
│   │   ├── hooks/
│   │   │   └── useGearTracker.ts
│   │   ├── lib/
│   │   │   └── api.ts           # Fetch wrapper for backend endpoints
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ⚙️ Environment Variables

Create `.env` files in both **backend** and **frontend** folders.  
Below are the most relevant keys:

### Backend `.env`
```bash
DATABASE_URL=postgresql://postgres:postgres@db:5432/phalcon
PORT=4000
BLIZZARD_CLIENT_ID=your_client_id
BLIZZARD_CLIENT_SECRET=your_client_secret
CACHE_TTL=3600
```

### Frontend `.env`
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_DEFAULT_REALM=quelthalas
NEXT_PUBLIC_DEFAULT_CHARACTER=Phalcon
```

---

## 🐳 Running Locally with Docker

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/phalcon-gear-tracker.git
   cd phalcon-gear-tracker
   ```

2. Start containers
   ```bash
   docker-compose up --build
   ```

3. Access the app
    - **Frontend:** http://localhost:3000
    - **Backend API:** http://localhost:4000

4. Verify database migration
   ```bash
   docker exec -it phalcon_backend npx prisma migrate deploy
   ```

---

## 🧠 Key Features

✅ Compare your current gear against BiS lists  
✅ Show detailed differences per slot (source, stats, notes)  
✅ Fetch real-time character data via Blizzard API  
✅ Responsive UI with theme toggle and persistent state  
✅ Local cache for improved performance  
✅ Modular API architecture for future expansion

---

## 🧪 Development Commands

### Backend
```bash
# Local run
npm run dev

# Check types
npx tsc --noEmit

# Format
npm run format
```

### Frontend
```bash
# Type check
npx tsc --noEmit

# Run dev mode
npm run dev

# Lint and build
npm run lint && npm run build
```

---

## 🧭 Example API Endpoints

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/compare/:character` | `GET` | Compare character’s gear vs BiS |
| `/api/character/:realm/:name` | `GET` | Fetch live Blizzard data |
| `/api/bis/:spec` | `GET` | Get Maxroll BiS reference for spec |
| `/health` | `GET` | Health check |

---

## 🧬 Data Flow

1. The backend retrieves the player’s current gear using **Blizzard’s API**.
2. It fetches **BiS references** from **Maxroll** (cached locally).
3. The comparison logic matches gear slots and identifies gaps.
4. The frontend displays a structured table or card grid, highlighting perfect, missing, or outdated items.

---

## 🧰 Development Notes

- The project enforces TypeScript type safety across the stack.
- The backend uses `axios` + `Promise.all` for efficient API calls.
- The frontend is strictly typed and fully compatible with SSR.
- Tailwind and ShadCN provide consistent design tokens.
- For future scalability, caching could be moved to Redis.

---

## 🧑‍💻 Contributing

Pull requests are welcome.  
To maintain consistency:
- Use feature branches (`feature/<scope>`).
- Follow the naming convention for commits:
  ```
  feat(api): add comparison endpoint
  fix(frontend): hydration provider mismatch
  refactor: optimize prisma queries
  ```
- Run type checks before committing.

---

## 📜 License

MIT License © 2025 — Héctor José Fernández Angulo

---

## 🐉 Future Enhancements

- OAuth integration for secure user profiles
- Historical gear tracking
- Leaderboards & class-based rankings
- Caching layer migration to Redis
- Mobile-optimized layout  
