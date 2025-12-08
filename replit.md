# Deeper - Christian Dating Conversation Card App

## Overview
Deeper is a mobile-first progressive web application for Christian couples to have meaningful conversations through faith-based discussion cards. Users swipe through question cards - swipe RIGHT to mark as "discussed", swipe LEFT to "save for later".

## Current State
- Full MVP implementation complete
- Database seeded with 9 categories and 45 sample questions
- Admin CMS functional with question and category management
- Frontend connected to real API data

## Tech Stack
- **Frontend**: React with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based for admin

## Project Structure
```
client/
  src/
    components/          # Reusable UI components
      SwipeCard.tsx      # Individual swipeable question card
      CardStack.tsx      # Stack of cards with swipe handling
      BottomNav.tsx      # Bottom navigation bar
      CategoryFilter.tsx # Category toggle grid
      ConversationJournal.tsx  # Saved/discussed questions list
      Onboarding.tsx     # First-time user tutorial
      PremiumTeaser.tsx  # Premium upsell card
    pages/
      Home.tsx           # Main card swipe experience
      AdminLogin.tsx     # Admin login page
      AdminDashboard.tsx # Admin overview with stats
      AdminQuestions.tsx # CRUD for questions
      AdminCategories.tsx # Category management
    lib/
      categories.ts      # Category/question types
      useLocalStorage.ts # LocalStorage hook for user progress

server/
  index.ts              # Express server entry
  routes.ts             # API routes
  storage.ts            # Database operations
  seed.ts               # Initial data seeding
  db.ts                 # Database connection

shared/
  schema.ts             # Drizzle schema definitions
```

## Database Schema
- **users**: Admin users (id, username, password)
- **categories**: 9 category types (name, icon, colors, order)
- **questions**: Conversation questions (text, categoryId, isPremium)

## API Endpoints

### Public
- `GET /api/categories` - List all categories
- `GET /api/questions` - List questions (optional categoryIds filter)

### Admin (requires session auth)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/session` - Check session status
- `GET /api/admin/dashboard` - Dashboard stats
- `GET/POST /api/admin/questions` - List/create questions
- `PUT/DELETE /api/admin/questions/:id` - Update/delete question
- `POST /api/admin/questions/bulk` - Bulk import questions
- `GET /api/admin/categories` - List categories
- `PUT /api/admin/categories/:id` - Update category
- `PUT /api/admin/categories/:id/order` - Reorder category

## Admin Access
- URL: `/admin`
- Username: `admin`
- Password: `deeper2024`

## User Progress
Stored in localStorage:
- `answeredQuestions`: IDs of discussed questions
- `savedForLater`: IDs of saved questions
- `currentFilters`: Active category IDs
- Onboarding status stored in cookies

## Color Palette (9 Categories)
1. Faith & Spirituality - Deep Grape Purple (#6F3FF0)
2. Family & Upbringing - Bubblegum Pink (#FF66C4)
3. Marriage Expectations - Peach Coral (#FF8A66)
4. Communication - Sky Blue (#4DAAFF)
5. Finances - Fresh Mint Green (#5EE6A8)
6. Intimacy - Soft Lilac (#C084FF)
7. Life Goals - Aqua/Teal (#1EC6C3)
8. Conflict Resolution - Warm Apricot (#FF9F4A)
9. Fun & Lifestyle - Sunny Yellow (#FFD54A)

## Recent Changes
- December 2024: Initial MVP implementation
  - Database schema created with Drizzle ORM
  - 45 sample questions seeded across 9 categories
  - Admin CMS with full CRUD operations
  - CSV import functionality for bulk question upload
  - Frontend connected to real API data
