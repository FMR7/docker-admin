-- initDB.sql
-- PostgreSQL initialization script for the application database.
-- This file can be mounted into /docker-entrypoint-initdb.d/ so it runs when the DB is first created.

BEGIN;

CREATE TABLE IF NOT EXISTS usuarios (
    username varchar(20) PRIMARY KEY,
    "password" varchar(512) NOT NULL,
    active boolean NOT NULL DEFAULT false,
    password_wrong_tries integer NOT NULL DEFAULT 0,
    "admin" boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS log (
    log_key bigserial PRIMARY KEY,
    username varchar(20) NOT NULL,
    "action" varchar NOT NULL,
    detail varchar,
    log_date timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT log_usuarios_fk FOREIGN KEY (username) REFERENCES usuarios(username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS container_config (
    container_key varchar(256) PRIMARY KEY,
    "name" varchar(50) NOT NULL,
    description varchar(256),
    active boolean NOT NULL DEFAULT true,
    admin_only boolean NOT NULL DEFAULT false
);

-- Optional initial data. Replace the admin password with a real hash if your app expects hashed passwords.
INSERT INTO usuarios (username, "password", active, password_wrong_tries, "admin")
VALUES ('admin', '$2b$10$9XFUVNkBXbu2L.wPFKpvEeSkALce6hRHJ7GV2mGX9KIg5WXtmecS2', true, 0, true)
ON CONFLICT (username) DO NOTHING;

INSERT INTO container_config (container_key, "name", description, active, admin_only)
VALUES
    ('123456789', 'Nginx', 'Nginx web server container', true, false),
    ('987654321', 'PostgreSQL', 'PostgreSQL database container', true, true)
ON CONFLICT (container_key) DO NOTHING;

COMMIT;
