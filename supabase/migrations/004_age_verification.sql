-- Migration 004: Age Verification Audit Trail
-- Required for Dutch Alcohol and Catering Act compliance

CREATE TABLE age_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT,
  customer_id UUID REFERENCES customers(id),
  method verification_method NOT NULL,
  verified BOOLEAN NOT NULL,
  date_of_birth DATE,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_age_verifications_session ON age_verifications(session_id);
CREATE INDEX idx_age_verifications_customer ON age_verifications(customer_id);
CREATE INDEX idx_age_verifications_created ON age_verifications(created_at DESC);
