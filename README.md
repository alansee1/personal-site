# Alan See - Personal Website

A minimalist personal portfolio built with Next.js, TypeScript, and Tailwind CSS. Features a cinematic entrance animation, smooth View Transitions, and real-time work tracking.

## ✨ Features

- **Cinematic Entrance Animation** - Loading dots, confetti, and theatrical curtain expansion
- **Minimalist Design** - Clean black/white aesthetic with smooth transitions
- **Section Navigation** - Projects, Blog, About, Work, and Shelf sections
- **Work Tracking** - Real-time work log powered by Supabase
- **Project Management** - Dynamic project pages with work item tabs and pagination
- **3D Bookshelf** - Interactive Three.js visualization of reading list
- **View Transitions API** - Native browser transitions for smooth navigation (Chrome/Edge)
- **Responsive Layout** - Works seamlessly across all devices
- **Fast Performance** - Built on Next.js 16 with optimized animations

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0
- **Database:** Supabase (PostgreSQL)
- **Animations:** Framer Motion + View Transitions API
- **3D Graphics:** Three.js / React Three Fiber
- **Icons:** Iconify React
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

1. Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
app/
├── page.tsx              # Main homepage with entrance animation
├── layout.tsx            # Root layout
├── globals.css           # Global styles
├── projects/             # Projects section with detail pages
│   └── [id]/            # Dynamic project pages with work tabs
├── blog/                 # Blog section
├── work/                 # Work log section
└── shelf/                # Reading shelf with 3D visualization

components/
├── WorkView.tsx          # Work items table with filters
├── ProjectsView.tsx      # Projects grid with search/sort
├── BookshelfView.tsx     # Reading list
└── ReadingVisualization3D.tsx  # 3D shelf visualization

lib/
├── types.ts              # Shared TypeScript types
├── supabase.ts           # Supabase client config
├── animations.ts         # Animation timing constants
└── viewTransition.ts     # View Transitions API helper

data/
├── shelf.ts              # Reading list data
└── blog.json             # Generated blog metadata

scripts/
├── generate-blog-data.js # Build script for blog.json
├── project-health.js     # DB/filesystem sync checker
└── enrich-books.js       # Google Books API enrichment
```

## 🤖 Development Workflow

This project uses custom Claude Code slash commands for streamlined development:

### Session Management
- `/session-start` - Load context from git status and dev diary
- `/dev-diary` - Log completed session work

### Work Item Tracking
- `/start-work` - Begin working on a pending item or create new
- `/log-work` - Complete in-progress work and add to database
- `/add-work` - Create pending work items for future

### Content Management
- `/create-blog-post` - Generate new blog post with frontmatter
- `/add-book` - Add books with Google Books API enrichment

### Project Management
- `/create-project` - Create new project (DB + markdown)
- `/update-project` - Sync project metadata with codebase

All slash commands are defined in `.claude/commands/` (global) and `personal-site/.claude/commands/` (project-specific).

## 🌐 Live Site

Visit [alansee.dev](https://alansee.dev) to see the site in action.

## 📝 License

Personal project - not open source.
