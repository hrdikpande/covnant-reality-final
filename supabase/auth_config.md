# Supabase Authentication Configuration Guide

Follow these steps in the [Supabase Dashboard](https://app.supabase.com/) to configure Authentication for Covnant Reality India PVT LTD.

## 1. Email + Password Authentication
1. Go to **Authentication** > **Providers**.
2. Find the **Email** provider.
3. Ensure **Enable Email provider** is toggled **ON**.
4. (Recommended) Enable **Confirm Email** to ensure valid users.

## 2. Google OAuth Configuration
1. Go to **Authentication** > **Providers**.
2. Find the **Google** provider and toggle it **ON**.
3. You will need to provide:
   - **Client ID**
   - **Client Secret**
4. To get these, go to the [Google Cloud Console](https://console.cloud.google.com/):
   - Create a new project or select an existing one.
   - Go to **APIs & Services** > **Credentials**.
   - Create **OAuth client ID** credentials (Web application).
   - Add your Supabase Callback URL (found in the Google provider settings in Supabase) to the **Authorized redirect URIs**.
5. Copy the Client ID and Secret back to Supabase.

## 3. Disable Phone Authentication
1. Go to **Authentication** > **Providers**.
2. Find the **Phone** provider.
3. Ensure it is toggled **OFF**.

## 4. Enable Row Level Security (RLS) Globally
Supabase enables RLS by default when you create new tables via the Dashboard UI. 
**When creating tables in the future, always ensure "Enable Row Level Security (RLS)" is checked.**

To verify RLS status:
1. Go to **Authentication** > **Policies**.
2. You can see the RLS status for all tables here.

## 5. Default Super Admin Account (Seed)

A default super-admin user is pre-seeded for development and initial setup.

| Field    | Value                             |
|----------|-----------------------------------|
| Email    | `super-admin@covnantreality.com`  |
| Password | `password@123`                    |
| Role     | `admin`                           |

### How to seed the admin user
1. Open the **Supabase Dashboard** → **SQL Editor**.
2. Open and run the file: `supabase/seed_admin.sql`
3. You should see the success notice: `✅ Admin seeded successfully`.
4. The script is **idempotent** — safe to re-run without creating duplicates.

> ⚠️ **Change the password** before going to production via the Supabase Dashboard → Authentication → Users.

