# CollegeCompass

![CollegeCompass Homepage](public/screenshot.png)

CollegeCompass is a production-ready, modern college discovery and decision-making platform inspired by Careers360 and Collegedunia. It enables users to search, filter, bookmark, and compare top IITs, NITs, IIITs, and Private Universities across India.

This platform is built with a Next.js 15 App Router frontend, a PostgreSQL database managed via Prisma ORM, and JWT authentication powered by NextAuth.js.

---

## Technical Stack

- **Frontend**: Next.js 15 (App Router, React Server Components), TypeScript, TailwindCSS, shadcn/ui.
- **Backend API**: Next.js Route Handlers.
- **Database**: PostgreSQL (Neon PostgreSQL in production), Prisma ORM.
- **Authentication**: NextAuth.js (Auth.js) with JWT session strategy and custom password hashing via `bcryptjs`.
- **Validation**: Zod schema validations for client query strings, request payloads, and registration models.
- **Hosting**: Vercel & Neon PostgreSQL.

---

## Architectural Features

1. **Server-Side Rendering & Pagination**: High-speed page rendering using Next.js Server Components. Search queries, locations, ratings, sorting criteria, and page items are calculated directly on the server to prevent blank flashes.
2. **Debounced Search**: Text search inputs wait for 500ms of user typing idle time before updating query parameters, optimizing rendering cycles and database query efficiency.
3. **Persisted Comparer**: The selection of up to 3 colleges to compare side-by-side persists across user sessions via `localStorage`, combined with an autocomplete search on the compare page.
4. **Snappy Bookmarks**: Saving or unsaving colleges in the user dashboard updates lists reactively on the client side, avoiding full page updates.
5. **Robust Error Boundaries**: Custom 404 handler (`not-found.tsx`), page-level loading state panels (`loading.tsx`), and a global crash boundary (`error.tsx`) protect the application from failing.

---

## Database Schema (Prisma)

The application implements a relational database structure containing:
- **User**: User account credentials and bookmarked associations.
- **College**: General specifications, average tuition fees, ratings, and site images.
- **Course**: Associated academic programs (B.Tech, MBA, M.Tech) with durations.
- **Placement**: Packages details linking average and peak salary metrics.
- **Review**: Student review commentary and stars rating parameters.
- **SavedCollege**: A unique joint model linking `User` and `College` for bookmarks.

```mermaid
erDiagram
  USER ||--o{ SAVED-COLLEGE : saves
  COLLEGE ||--o{ COURSE : offers
  COLLEGE ||--o{ PLACEMENT : placement_stats
  COLLEGE ||--o{ REVIEW : reviews
  COLLEGE ||--o{ SAVED-COLLEGE : is_saved
```

---

## API Documentation

### 1. Authentication

#### `POST /api/auth/register`
Creates a new User account.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Responses**:
  - `201 Created`: Account saved.
  - `400 Bad Request`: Validation failure (Zod) or email duplicate.
  - `500 Server Error`.

#### NextAuth credentials routes:
- `POST /api/auth/callback/credentials` - Processes login.
- `GET/POST /api/auth/session` - Retrieves user session token.

---

### 2. Colleges & Discovery

#### `GET /api/colleges`
Retrieves a list of paginated, sorted, and filtered colleges.
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 9)
  - `search` (string, filters name, location, or courses)
  - `location` (string, matching city name)
  - `rating` (number, minimum rating threshold)
  - `sort` (`rating_desc` | `rating_asc` | `fees_desc` | `fees_asc`)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "colleges": [...],
      "pagination": {
        "total": 100,
        "page": 1,
        "limit": 9,
        "totalPages": 12
      }
    }
  }
  ```

#### `GET /api/colleges/[id]`
Retrieves full details of a specific college.
- **Response**: Returns the college schema combined with its courses, placements, and reviews array.

#### `GET /api/compare`
Retrieves comparative data for up to 3 colleges.
- **Query Parameters**:
  - `ids` (comma-separated UUIDs, e.g. `?ids=id1,id2,id3`)
- **Response**: Returns detailed rows list of the requested institutions.

---

### 3. Bookmarks (Saved Colleges)

#### `GET /api/saved`
Retrieves the saved colleges list for the authenticated session. (Requires Auth header / cookie).

#### `POST /api/saved`
Bookmarks a college.
- **Request Body**:
  ```json
  {
    "collegeId": "college-uuid-string"
  }
  ```

#### `DELETE /api/saved/[id]`
Removes a college from saved list. (Pass the college ID in the dynamic path).

---

## Setup & Running Locally

### Prerequisites
- Node.js (version 18 or 20)
- PostgreSQL running locally or a Neon PostgreSQL account

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root folder (or copy `.env.example`):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/collegecompass?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_jwt_secret_here"
```

### 3. Run Database Migrations
Generate tables and structure inside PostgreSQL:
```bash
npx prisma migrate dev --name init
```

### 4. Seed the Database
Populate the database with exactly 100 realistic colleges (IITs, NITs, IIITs, and Private Universities), courses, packages, and reviews:
```bash
npx prisma db seed
```

### 5. Launch the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- Demo credentials:
  - **Email**: `demo@collegecompass.com`
  - **Password**: `password123`

---

## Deployment Readiness

### 1. Neon PostgreSQL Setup
1. Sign up on [Neon.tech](https://neon.tech/) and create a new PostgreSQL project.
2. Select your preferred region and click **Create Project**.
3. Copy the connection string provided in the Neon Console.
4. Replace the `DATABASE_URL` in your `.env` file with this string (append `?sslmode=require`).

### 2. Vercel Deployment
1. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Select your repository and configure the framework preset as **Next.js**.
3. Add the following **Environment Variables** in the project settings:
   - `DATABASE_URL` (your Neon database string)
   - `NEXTAUTH_URL` (your production URL, e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET` (generate a secure string via `openssl rand -base64 32`)
4. Configure the **Build Command** if needed, Vercel will automatically run `npm run build`. Vercel automatically deploys database clients, but we recommend adding a `postinstall` script in your `package.json` to generate the client:
   `"postinstall": "prisma generate"`
5. Click **Deploy**.
