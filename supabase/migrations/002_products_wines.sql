-- Migration 002: Products & Wines
-- Wine catalog tables with full-text search

CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'France',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE grapes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE producers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  region_id UUID REFERENCES regions(id),
  description TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type wine_type NOT NULL,
  body wine_body,
  producer_id UUID REFERENCES producers(id),
  region_id UUID REFERENCES regions(id),
  vintage INTEGER,
  alcohol_percentage DECIMAL(4,2),
  price_cents INTEGER NOT NULL,
  compare_at_price_cents INTEGER,
  sku TEXT UNIQUE,
  image_url TEXT,
  thumbnail_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  tasting_notes TEXT,
  food_pairing TEXT,
  serving_temperature TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  weight_grams INTEGER,
  volume_ml INTEGER NOT NULL DEFAULT 750,
  meta_title TEXT,
  meta_description TEXT,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Wine-Grape junction table
CREATE TABLE wine_grapes (
  wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
  grape_id UUID REFERENCES grapes(id) ON DELETE CASCADE,
  percentage INTEGER,
  PRIMARY KEY (wine_id, grape_id)
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wine_categories (
  wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (wine_id, category_id)
);

-- Full-text search index with Dutch stemmer
CREATE INDEX idx_wines_search ON wines USING GIN(search_vector);
CREATE INDEX idx_wines_slug ON wines(slug);
CREATE INDEX idx_wines_type ON wines(type);
CREATE INDEX idx_wines_is_active ON wines(is_active) WHERE is_active = true;
CREATE INDEX idx_wines_price ON wines(price_cents);
CREATE INDEX idx_wines_name_trgm ON wines USING GIN(name gin_trgm_ops);

-- Auto-update search vector
CREATE OR REPLACE FUNCTION wines_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('dutch', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('dutch', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('dutch', COALESCE(NEW.tasting_notes, '')), 'C') ||
    setweight(to_tsvector('dutch', COALESCE(NEW.food_pairing, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wines_search_vector_trigger
  BEFORE INSERT OR UPDATE ON wines
  FOR EACH ROW EXECUTE FUNCTION wines_search_vector_update();

-- Auto-update updated_at triggers
CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON regions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_producers_updated_at BEFORE UPDATE ON producers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_wines_updated_at BEFORE UPDATE ON wines FOR EACH ROW EXECUTE FUNCTION update_updated_at();
