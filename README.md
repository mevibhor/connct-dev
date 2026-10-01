# Connct.dev

A modern developer collaboration platform built with **Next.js 15**, designed to help developers discover people, share projects, and find potential collaborators.

Built from a **Design reference:** [Social Media UI Kit — Web & Mobile Community](https://www.figma.com/design/GVVCGaKz8lk9WUS9V42pXE/Social-Media-UI-Kit---Web---Mobile--Community-?node-id=21-578&t=62RxA7jqbaeoTaHQ-0) and independently adapted into a responsive, production-style frontend with a focus on **UI quality, frontend architecture, and real interactions**.

## Preview

<img width="1672" height="941" alt="Connct Dev Multi-Device Showcase" src="https://github.com/user-attachments/assets/eeca3df4-f0c8-463a-98b7-d4f800569f04" />

## Features

* 🔐 Signup & mock authentication
* 👤 Developer profiles & editable tech stacks
* 🔎 Debounced developer search & filtering
* 📁 Project creation & project feed
* ♾️ Infinite scroll for projects and developers
* 🔖 User-specific bookmarks
* 🤝 Collaboration / inquiry flow
* ⚡ Server-state caching with TanStack Query
* 🌙 Dark & light themes
* ✅ React Hook Form + Zod validation
* 📱 Responsive desktop & mobile UI
* 💾 Persistent JSON-based data through API routes
* 🧩 Loading, empty & error states

## Tech Stack

**Next.js 15 · React 19 · TypeScript · Tailwind CSS · Zustand · TanStack Query · React Hook Form · Zod · shadcn/ui**

## Frontend Highlights

* Debounced search to reduce unnecessary API requests
* Infinite queries with paginated API responses
* Client-side caching and query invalidation
* Responsive component architecture
* Reusable UI and form patterns
* URL-synced search and filters
* Persistent client authentication state
* Dark/light theme support
* Skeleton loading and error handling
* Server-state and client-state separation

## Architecture

```text
UI Components
      ↓
TanStack Query / Zustand
      ↓
Next.js API Routes
      ↓
Server-side Data Layer
      ↓
data/db.json
```

The UI communicates through API routes rather than accessing the JSON data directly, keeping presentation, state management, and persistence separated.

## Design

The UI was adapted from a Figma Community design reference and independently extended to fit the Connct.dev product requirements.

The implementation focuses on translating design specifications into responsive React components with consistent spacing, typography, states, themes, and interactions.

**Design reference:** Social Media UI Kit — Web & Mobile Community

## Getting Started

```bash
git clone <repository-url>
cd connct-dev
npm install
npm run dev
```

Open `http://localhost:3000`.

## Note

This is a portfolio project focused on demonstrating modern frontend development, UI implementation, state management, server-state handling, and practical React patterns.

Authentication and persistence are intentionally simplified for the scope of the project.
