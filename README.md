# Smart Bookmark App

A full-stack bookmark manager application built using Next.js (App Router), Supabase, and Tailwind CSS.  
Users can securely log in using Google OAuth, add private bookmarks, and see real-time updates across multiple tabs.


## 🚀 Live Demo

Live URL: https://your-app.vercel.app  
GitHub Repository:https://github.com/BalamIndira/smart-bookmark-app.git


## 🛠 Tech Stack

- Next.js (App Router)
- Supabase (Authentication, Database, Realtime)
- Tailwind CSS
- Vercel (Deployment)



## ✨ Features

- Google OAuth login (No email/password authentication)
- Add bookmarks (Title + URL)
- Bookmarks are private to each user
- Real-time updates across multiple tabs
- Delete bookmarks
- Fully deployed and production-ready



## 🔐 Authentication

Authentication is handled using Supabase Google OAuth.

- Users sign in using their Google account
- Supabase manages sessions securely
- After login, users are redirected to the dashboard


## 🗄 Database Schema

Table: `bookmarks`

| Column Name | Type      | Description |
|------------|-----------|------------|
| id         | uuid      | Primary Key |
| user_id    | uuid      | References authenticated user |
| title      | text      | Bookmark title |
| url        | text      | Bookmark URL |
| created_at | timestamp | Created time |


## 🔒 Row Level Security (RLS)

RLS is enabled to ensure bookmarks are private per user.

### Policies Used:

SELECT Policy:
auth.uid() = user_id

INSERT Policy:
auth.uid() = user_id

DELETE Policy:
auth.uid() = user_id


This ensures:
- Users can only see their own bookmarks
- Users cannot access other users' data


## 🔄 Real-Time Implementation

Supabase Realtime subscriptions are used.

When:
- A bookmark is added
- A bookmark is deleted

All open tabs automatically update without refreshing the page.

This is implemented using:
supabase.channel().on("postgres_changes")


## 🧠 Challenges Faced & Solutions

### 1️⃣ Google OAuth Redirect Issue

Problem:
After login, the app was not redirecting properly.

Solution:
Corrected the redirect URL inside:
- Supabase Auth settings
- Google Cloud Console OAuth settings


### 2️⃣ RLS Policy Error

Problem:
Bookmarks were not being inserted due to permission errors.

Solution:
Enabled Row Level Security and added proper policies for SELECT, INSERT, and DELETE.


### 3️⃣ Realtime Not Triggering

Problem:
Real-time updates were not working across tabs.

Solution:
Subscribed to the correct channel and ensured table name and schema were correctly specified.


## 📦 Project Structure

smart-bookmark-app/
│
├── app/
│   ├── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│
├── lib/
│   └── supabase.ts
│
├── components/
│
├── README.md
├── package.json
└── .env.local



## ⚙️ Environment Variables

The following environment variables are required:

NEXT_PUBLIC_SUPABASE_URL= https://qoagjghhmimorqsdulyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvYWdqZ2hobWltb3Jxc2R1bHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDkwNzEsImV4cCI6MjA4NjQ4NTA3MX0.rCONDWIwjrh95qELCQBDw33BhsbD3lQ4qmc-JXd6d_A


These are configured in:
- `.env.local` (for local development)
- Vercel Project Settings → Environment Variables (for production)


## 🚀 Deployment

The app is deployed on Vercel.

Steps:
1. Push code to GitHub
2. Import repository into Vercel
3. Add environment variables
4. Deploy


## 🎯 What This Project Demonstrates

- OAuth Authentication
- Secure Database Access using RLS
- Real-time Data Sync
- Full-stack architecture
- Deployment workflow
- Production-level configuration
