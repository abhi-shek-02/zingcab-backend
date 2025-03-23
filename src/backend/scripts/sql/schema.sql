
-- ZingCab Database Schema for Supabase

-- Users Table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  phone_number text unique not null,
  email text unique,
  name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  profile_image text,
  notification_token text,
  is_active boolean default true
);

-- Drivers Table
create table public.drivers (
  id uuid primary key default uuid_generate_v4(),
  phone_number text unique not null,
  name text not null,
  email text unique,
  license_number text unique not null,
  license_expiry date not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  is_active boolean default true,
  is_available boolean default false,
  rating numeric(3,2) default 0,
  current_location jsonb
);

-- Cars Table
create table public.cars (
  id uuid primary key default uuid_generate_v4(),
  model text not null,
  make text not null,
  year integer not null,
  license_plate text unique not null,
  capacity integer not null,
  car_type text not null,
  driver_id uuid references public.drivers(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  is_active boolean default true
);

-- Bookings Table
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) not null,
  driver_id uuid references public.drivers(id),
  car_id uuid references public.cars(id),
  booking_type text not null,
  pickup_location jsonb not null,
  dropoff_location jsonb not null,
  pickup_time timestamp with time zone not null,
  estimated_fare numeric(10,2) not null,
  status text not null default 'pending',
  payment_status text not null default 'pending',
  payment_method text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  cancellation_reason text,
  distance_km numeric(10,2),
  duration_minutes integer,
  actual_fare numeric(10,2)
);

-- Contact Us Table
create table public.contactUs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phoneNumber text not null,
  message text not null,
  created_at timestamp with time zone default now(),
  resolved boolean default false,
  resolved_at timestamp with time zone,
  resolved_by text
);

-- Add RLS policies as needed for your application
