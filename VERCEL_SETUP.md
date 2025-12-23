# Vercel Deployment Setup Guide

## Environment Variables Configuration

To fix the Supabase 500 error on Vercel, you need to configure the following environment variables:

### Required Environment Variables

Go to your Vercel project settings → Environment Variables and add:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - Where to find: Supabase Dashboard → Project Settings → API → Project URL

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your Supabase anonymous/public key
   - Where to find: Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public`

3. **ADMIN_PASSWORD** (optional, for admin authentication)
   - Value: Your admin dashboard password
   - Set your own secure password

### Steps to Configure

1. Login to [Vercel Dashboard](https://vercel.com)
2. Select your `peppory` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with these settings:
   - Environment: `Production`, `Preview`, and `Development` (select all)
   - Click **Save**
5. **Redeploy** your application after adding variables

### Verify Configuration

After deployment, check Vercel logs:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Go to **Functions** logs
4. Look for any error messages from Supabase

If you see "Missing Supabase environment variables", the variables weren't configured correctly.

## Supabase Database Setup

### 1. Create Products Table

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

-- Allow authenticated insert (for admin)
CREATE POLICY "Admin insert access" ON products
  FOR INSERT WITH CHECK (true);

-- Allow authenticated update (for admin)
CREATE POLICY "Admin update access" ON products
  FOR UPDATE USING (true);

-- Allow authenticated delete (for admin)
CREATE POLICY "Admin delete access" ON products
  FOR DELETE USING (true);
```

### 2. Create Storage Bucket for Product Images

1. Go to Supabase Dashboard → Storage
2. Create new bucket named `products`
3. Set bucket to **Public**
4. Configure policies:

```sql
-- Allow public read access to product images
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

-- Allow authenticated upload
CREATE POLICY "Admin upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products');

-- Allow authenticated delete
CREATE POLICY "Admin delete access" ON storage.objects
  FOR DELETE USING (bucket_id = 'products');
```

## Common Issues & Solutions

### Issue: "Supabase not configured - missing environment variables"

**Solution:**
- Verify environment variables are set in Vercel
- Ensure variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Issue: Database error "relation products does not exist"

**Solution:**
- Create the `products` table using the SQL above
- Verify table name is lowercase

### Issue: "new row violates row-level security policy"

**Solution:**
- Ensure RLS policies are created
- Verify the policies allow the operations you need

### Issue: Image upload fails

**Solution:**
- Create `products` storage bucket
- Set bucket to public
- Configure storage policies

## Testing

After setup, test the deployment:

1. Visit `https://peppory.vercel.app/admin`
2. Login with your admin password
3. Try creating a new product
4. Check Vercel function logs for any errors

## Local Development

For local development, create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
ADMIN_PASSWORD=your_password_here
```

**Never commit this file to git!** (Already in `.gitignore`)
