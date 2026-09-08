# 🎬 Stream Sense

A modern, full-featured movie discovery, recommendation, and streaming aggregator web application built with **React 19**, **Vite 6**, and **Supabase**.

Explore trending films, check streaming provider availability across platforms, view cast and trailers, stay updated with the latest movie news, and sync your favorite movies securely to the cloud.

---

## ✨ Features

- 🌟 **Discover & Browse**:
  - Trending and popular movies fetched in real-time from **TMDB**.
  - Curated categories: *Hollywood*, *Bollywood*, *Korean*, *Dubbed*, *Series*, and genres (*Action*, *Comedy*, *Drama*, *Horror*, *Romance*, *Thriller*).
- 📺 **Streaming Availability**:
  - Powered by **Watchmode API** to tell users where to stream, rent, or buy any movie across major streaming providers (Netflix, Prime Video, Disney+, Apple TV, etc.).
- 🔍 **Smart Search & Deep Details**:
  - Search movies and TV shows with instant results.
  - View full cast biographies, filmographies, and credits.
  - One-click Rotten Tomatoes search and embedded YouTube trailers.
- 📰 **Movie News**:
  - Curated entertainment and cinema news powered by **NewsAPI**.
- 🔐 **User Authentication & Cloud Favorites**:
  - Complete email/password authentication powered by **Supabase Auth**.
  - Secure personal favorites synced to Supabase database with Row-Level Security (RLS) isolation.
  - Guest mode with instant prompt to log in when saving favorites.
- 🌓 **Dark / Light Mode**:
  - Built-in theme switcher with automatic preference persistence in `localStorage`.
- 🚀 **Production & Cloud Ready**:
  - Pre-configured for deployment on **Render** (Web Service or Static Site), Netlify, and Vercel.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7
- **Build Tool**: Vite 6
- **Styling**: Vanilla CSS (Custom Design System, Glassmorphism, Responsive Grid)
- **Backend / BaaS**: Supabase (PostgreSQL, GoTrue Auth, Row-Level Security)
- **External APIs**:
  - [The Movie Database (TMDB)](https://www.themoviedb.org/)
  - [Watchmode API](https://api.watchmode.com/)
  - [OMDb API](https://www.omdbapi.com/)
  - [YouTube Data API v3](https://developers.google.com/youtube/v3)
  - [NewsAPI](https://newsapi.org/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/RohitMaurya-16/Stream.git
cd Stream
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the template file `.env.example` to create your `.env` file:

```bash
cp .env.example .env
```

Open `.env` and fill in your API credentials:

```env
# Movie and Third-Party APIs
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_WATCHMODE_API_KEY=your_watchmode_api_key
VITE_OMDB_API_KEY=your_omdb_api_key
VITE_NEWS_API_KEY=your_news_api_key

# Supabase Authentication & Database
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note**: Your `.env` file is included in `.gitignore` to keep your sensitive API keys safe from public exposure.

---

### 4. Supabase Database Setup

To enable user favorites and cloud syncing:
1. Go to your [Supabase Dashboard](https://app.supabase.com) -> **SQL Editor**.
2. Run the SQL script located in [`supabase_schema.sql`](./supabase_schema.sql) to create the `user_favorites` table and configure Row-Level Security (RLS) policies.

---

### 5. Run the Application Locally

```bash
# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Vite development server with HMR |
| `npm run build` | Bundles production assets into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm start` | Starts the production preview server (configured for Render) |
| `npm run lint` | Lints files with ESLint |

---

## 🌐 Deployment (Render)

This project includes configuration for seamless deployment on **Render**:

1. Create a new **Web Service** or **Static Site** on [Render](https://render.com) connected to this repository.
2. Configure settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (or Publish Directory: `dist` if deploying as Static Site)
3. Under **Environment**:
   - Add each of the `VITE_*` environment variables listed in `.env.example`.
   *(Or click **Add Secret File**, name it `.env`, and paste your environment variables).*
4. Single-Page Application (SPA) routing is handled automatically via [`public/_redirects`](./public/_redirects) and [`render.yaml`](./render.yaml).

---

## 📄 License

This project is licensed under the MIT License.

---

### Developed with ❤️ by [RohitMaurya-16](https://github.com/RohitMaurya-16)
