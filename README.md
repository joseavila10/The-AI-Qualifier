# B2B ICP & Prospect Qualification App

A web app that helps companies generate **AI-based Ideal Customer Profiles (ICPs)** and **qualify potential prospects** against them. Built with **Next.js** and **PostgreSQL (Supabase)**, it leverages AI to automate B2B sales insights.

---

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/b2b-icp-app.git
   cd b2b-icp-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
    - Create a .env file in the root of the project with the following variables:
    ```ini
        NODE_ENV
        ENCRYPTATION_SECRET_KEY
        JWT_SECRET_KEY
        JWT_EXPIRES_IN_HOURS=4
        SUPABASE_URL
        SUPABASE_KEY
        OPENAI_API_KEY

    ```
4. Run the development server:
    ```bash
    npm run dev
    ```

Open http://localhost:3000 in your browser to see the app.  

If everything is set up correctly, you’ll be able to:  
- Sign up or log in using your credentials.  
- Add a company domain to generate its AI-powered profile.  
- Create an ICP (Ideal Customer Profile) for your company.  
- Enter multiple prospect domains to automatically generate fit scores and reasoning.  
- Review all saved ICPs and prospect qualification results.  

---

## Folder Structure

```
b2b-icp-app/
├── src/
│   ├── pages/              # Next.js pages (routes)
│   ├── app/                # Components, helpers, constants
│   ├── services/           # API and database service functions
│   ├── components/         # Custom UI components
│   ├── helpers/            # Utilities (validation, fetch, etc.)
│   └── styles/             # Tailwind and global CSS
├── public/                 # Static assets (images, icons, etc.)
├── .env                    # Environment variables
├── package.json
└── README.md
```

---

## Deployment

You can deploy the app easily using **Vercel** (recommended for Next.js):  

1. Push your project to GitHub.  
2. Go to [https://vercel.com](https://vercel.com) and import your repo.  
3. Set your environment variables in the Vercel dashboard.  
4. Deploy — your app will be live in seconds.

Alternatively, you can deploy manually to **Render**, **Netlify**, or any **Node.js-compatible server**.

---

## Backend routes and services

This project includes custom **CLI scripts** to automatically generate **API routes** and **service files**, keeping your folder structure clean and consistent.

###  1. Create API Routes

Generate a new API route inside `src/pages/api/` using:

```bash
npm run create:route 'route-name'
```

####  Examples

```bash
# Simple route (creates src/pages/api/users/index.ts)
npm run create:route 'users'

# Nested route (creates src/pages/api/companies/list/index.ts)
npm run create:route 'companies/list'

# Dynamic route (creates src/pages/api/users/[id].ts)
npm run create:route 'users/:id'
```

####  What it does
- Automatically creates folders (if missing)
- Supports **dynamic route parameters** (`:id` → `[id].ts`)
- Generates a ready-to-use API handler template with:
  - Built-in method switch (`GET`, `POST`, `PUT`, `DELETE`)
  - Authentication middleware import
  - Default error handling (`methodNotAllowed`, `methodNotImplemented`)

>  The script prevents overwriting existing files and shows clear error messages.

---

###  2. Create Service Files

Generate a new **service module** inside `src/app/services/` using:

```bash
npm run create:service 'service-name'
```

####  Examples

```bash
# Creates src/app/services/auth/index.ts
npm run create:service 'auth'

# Nested service (creates src/app/services/companies/details/index.ts)
npm run create:service 'companies/details'
```

####  What it does
- Automatically creates the folder structure if missing.
- Generates a base TypeScript template:
  - Includes `NextApiRequest` and `NextApiResponse` types
  - Imports the configured `supaBaseClient`
  - Exports a function named after your service (e.g., `authService`)

---

###  File Structure Overview

After running the scripts, your project will look like:

```
src/
├── pages/
│   └── api/
│       ├── users/
│       │   └── index.ts
│       └── companies/
│           └── [id].ts
└── app/
    └── services/
        ├── auth/
        │   └── index.ts
        └── companies/
            └── details/
                └── index.ts
```

---

###  Notes
- Wrap your route or service name in **quotes** if it includes `/` or `:`.  
- Dynamic routes (`:id`) are automatically transformed into `[id].ts`.  
- The scripts use Node’s built-in `fs` and `path` modules — no dependencies needed.  
- Logs show a green check icon success message when the file is created, or red cross icon if it already exists.

---

**Example output:**

```
$ npm run create:route 'users/:id'
Creating route file: src/pages/api/users/[id].ts
Route file created: src/pages/api/users/[id].ts
```

---

With these scripts, you can scaffold API routes and service files instantly — no more manual setup.

---

## Features

- **User Authentication**: Simple signup/login flow.
- **Company Onboarding**: Enter company domain → scrape website → generate AI-based company summary.
- **ICP Generation**: Automatically generates structured ICPs with:
  - Title & description
  - 3–5 buyer personas (roles, departments, pain points)
  - Company size, revenue range, industries, regions, and funding stage
- **Prospect Qualification**: Enter multiple domains → compare against ICP → return:
  - Fit score (0–100)
  - Reasoning
  - Matched personas & key signals
- **Results Management**: Store all ICPs and prospect qualification results for review.

---

## Tech Stack

- **Frontend & Backend**: [Next.js](https://nextjs.org/) (React + API Routes)
- **Database**: [PostgreSQL via Supabase](https://supabase.com/)
- **AI Integration**: OpenAI API (`gpt-4o-mini`)
- **Styling**: TailwindCSS (optional)

---

## Database Schema

### Users

```sql
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default now()
);
```

### Companies

```sql
create table companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  domain text not null,
  name text not null,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```
### ICPs
```sql
create table public.icps (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  title text not null,
  description text,
  buyer_personas jsonb,
  company_size text,
  revenue_range text,
  industries text[],
  regions text[],
  funding_stage text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```
### Prospect Qualifications
```sql
create table public.prospect_qualifications (
  id uuid primary key default gen_random_uuid(),
  icp_id uuid references icps(id) on delete cascade,
  domain text not null,
  fit_score integer not null,
  reasoning text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);
```

 **User Authentication**: Simple signup/login flow.
- **Company Onboarding**: Enter company domain → scrape website → generate AI-based company summary.
- **ICP Generation**: Automatically generates structured ICPs with:
  - Title & description
  - 3–5 buyer personas (roles, departments, pain points)
  - Company size, revenue range, industries, regions, and funding stage
- **Prospect Qualification**: Enter multiple domains → compare against ICP → return:
  - Fit score (0–100)
  - Reasoning
  - Matched personas & key signals
- **Results Management**: Store all ICPs and prospect qualification results for review.

---

## Tech Stack

- **Frontend & Backend**: [Next.js](https://nextjs.org/) (React + API Routes)
- **Database**: [PostgreSQL via Supabase](https://supabase.com/)
- **AI Integration**: OpenAI API (`gpt-4o-mini`)
- **Styling**: TailwindCSS

---
