# Deeper - Christian Dating Conversation Card App

## Overview
Deeper is a mobile-first progressive web application for Christian couples to have meaningful conversations through faith-based discussion cards. Users swipe through question cards - swipe RIGHT to mark as "discussed", swipe LEFT to "save for later".

## Current State
- Full MVP implementation complete with Figma-matched design
- Database seeded with 9 categories and 45 sample questions
- Admin CMS functional with question and category management
- Frontend connected to real API data
- New card design with white outer border and colored inner content
- Floating circular action buttons (Topics + Journal) replacing bottom nav

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
- **users**: Admin users (id, email, password)
- **categories**: 9 category types (name, icon, colors, order, fillType, gradientFrom/To, textColor, borderColor, borderWidth, imageUrl)
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
- Email: `j.caspari@mail.de`
- Password: `deeper2024`

## User Progress
Stored in localStorage:
- `answeredQuestions`: IDs of discussed questions
- `savedForLater`: IDs of saved questions
- `currentFilters`: Active category IDs
- Onboarding status stored in cookies

## Color Palette (9 Categories - Updated Figma Design)
1. Character and Personality - Red (#ff4d4f), text: #bf0000
2. Origin and Family - Orange (#ff8500), text: #d54900
3. Humor and Joy - Yellow (#ffdc54), text: #cda505
4. Relationship and Communication - Teal (#008475), text: #43f2da
5. Finances - Mint (#00c9b5), text: #195b5d
6. Faith - Light Teal (#9ed1d6), text: #4b8085
7. Sexuality - Purple (#8253ee), text: #c6a8ff
8. Future and Marriage - Blue (#455fed), text: #acbeff
9. Deep Topics - Navy (#004a7e), text: #92d6ff

All categories use white borders (#FFFFFF, 8px width) for the card design.

## Recent Changes
- December 2024: Initial MVP implementation
  - Database schema created with Drizzle ORM
  - 45 sample questions seeded across 9 categories
  - Admin CMS with full CRUD operations
  - CSV import functionality for bulk question upload
  - Frontend connected to real API data
- December 2024: Figma Design Update
  - New card design with white outer border (8px) and colored inner content
  - Floating circular action buttons replacing bottom navigation
  - DM Sans font applied globally
  - Updated category color palette matching Figma mockups
  - Runtime database migrations for production schema sync
