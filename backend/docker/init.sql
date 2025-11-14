-- docker/init.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drops (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    total_quantity INT NOT NULL CHECK (total_quantity >= 0),
    max_per_user INT NOT NULL DEFAULT 1 CHECK (max_per_user > 0),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    claim_start_time TIMESTAMPTZ NOT NULL,
    claim_end_time TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drops_active_time
    ON drops (is_active, start_time, end_time);


CREATE TABLE IF NOT EXISTS waitlist_entries (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    drop_id INT NOT NULL REFERENCES drops(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, drop_id)
);

CREATE INDEX IF NOT EXISTS idx_waitlist_drop_joined
    ON waitlist_entries (drop_id, joined_at);


CREATE TABLE IF NOT EXISTS claims (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    drop_id INT NOT NULL REFERENCES drops(id) ON DELETE CASCADE,
    claim_code TEXT NOT NULL UNIQUE,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'claimed',
    UNIQUE (user_id, drop_id)
);

CREATE INDEX IF NOT EXISTS idx_claims_drop
    ON claims (drop_id, claimed_at);
