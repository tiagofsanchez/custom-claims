# CREDERE 2 sided Login and Auth attempt, a multi-user authentication approach

In this case I am trying the **Supabase Custom claims approach**

I want to create a NEXT APP with Supabase where I can have 2 types of users to Logged in: 
- For Broker that are on our platform and could sign up to the platform in order to have **(1)** a website and presence online and **(2)** a better way to manage their leads online
- For Users that are looking for a mortgage in the marketplace and want to get a better deal on their mortgage

We want to implement 2 flows: 

(1) The Broker flow
  - Log in
  - Dashboard for the broker
  - Details page to fill in
  - Existing leads

(2) The Client flow  
  - Log in
  - Dashboard
  - Details page
  - Simulation
  - Effort rate
  - select your broker

## Creating a NEXT JS APP

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Connecting to your Supabase backend

You will need to create your backend to test it out

## Set things with the User Management Starter

```
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

```

## Set up the Custom-Claims

As per [Supabase Custom Claims](https://github.com/supabase-community/supabase-custom-claims) s



## Use the AUTH UI 

As per [Supabase AUTH UI documentation](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)


**Things that I need to do and solve for:**
- Have a way to toggle between the logins so that the user can be "recorded" with a certain `userrole`
- Every time the user is logged in and there is a session how can I check role for the user so that my client side is different? There is the `get_my_claims` function that can be call to know that... but what would be the best way to get that detail? 
- How would I get my relationship between Broker and Client in a way that Broker can have multiple Clients, but the Client only can have one selected Broker? 