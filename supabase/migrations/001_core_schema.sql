-- Migration 001: Core Schema
-- Extensions, enums, and utility functions

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Enums
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'expired',
  'cancelled',
  'refunded',
  'partially_refunded'
);

CREATE TYPE wine_type AS ENUM (
  'red',
  'white',
  'rose',
  'sparkling',
  'dessert',
  'fortified',
  'orange'
);

CREATE TYPE wine_body AS ENUM (
  'light',
  'medium_light',
  'medium',
  'medium_full',
  'full'
);

CREATE TYPE verification_method AS ENUM (
  'checkbox',
  'date_of_birth',
  'idin'
);

-- Utility function: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
