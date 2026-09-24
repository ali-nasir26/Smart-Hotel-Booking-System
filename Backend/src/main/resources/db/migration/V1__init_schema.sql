CREATE TABLE IF NOT EXISTS role (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(120),
    last_name VARCHAR(120),
    email VARCHAR(190) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_token_expiry TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS room (
    id BIGSERIAL PRIMARY KEY,
    room_type VARCHAR(120),
    room_price NUMERIC(10, 2),
    photo OID
);

CREATE TABLE IF NOT EXISTS booked_room (
    booking_id BIGSERIAL PRIMARY KEY,
    check_in DATE,
    check_out DATE,
    guest_full_name VARCHAR(180),
    guest_email VARCHAR(190),
    adults INTEGER,
    children INTEGER,
    total_guest INTEGER,
    confirmation_code VARCHAR(120),
    room_id BIGINT,
    CONSTRAINT fk_booked_room_room FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE SET NULL
);

INSERT INTO role (name) VALUES ('ROLE_USER') ON CONFLICT (name) DO NOTHING;
INSERT INTO role (name) VALUES ('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;
