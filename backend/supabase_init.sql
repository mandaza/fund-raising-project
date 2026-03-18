BEGIN;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> 0001_init

CREATE TABLE admins (
    id UUID NOT NULL, 
    username VARCHAR(150) NOT NULL, 
    password_hash VARCHAR(255) NOT NULL, 
    is_active BOOLEAN DEFAULT true NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT uq_admins_username UNIQUE (username)
);

CREATE INDEX ix_admins_username ON admins (username);

CREATE TYPE guest_type AS ENUM ('individual', 'corporate', 'sponsor', 'vip');

CREATE TABLE guests (
    id UUID NOT NULL, 
    full_name VARCHAR(200) NOT NULL, 
    email VARCHAR(320), 
    phone VARCHAR(50), 
    guest_type guest_type DEFAULT 'individual' NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT uq_guests_email UNIQUE (email)
);

CREATE INDEX ix_guests_email ON guests (email);

CREATE INDEX ix_guests_phone ON guests (phone);

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

CREATE TABLE bookings (
    id UUID NOT NULL, 
    guest_id UUID NOT NULL, 
    reference VARCHAR(32) NOT NULL, 
    status booking_status DEFAULT 'pending' NOT NULL, 
    seats INTEGER DEFAULT '1' NOT NULL, 
    notes VARCHAR(500), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT fk_bookings_guest_id FOREIGN KEY(guest_id) REFERENCES guests (id) ON DELETE CASCADE, 
    CONSTRAINT uq_bookings_reference UNIQUE (reference)
);

CREATE INDEX ix_bookings_guest_id ON bookings (guest_id);

CREATE INDEX ix_bookings_reference ON bookings (reference);

CREATE INDEX ix_bookings_status ON bookings (status);

CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'ecocash', 'visa', 'other');

CREATE TABLE payments (
    id UUID NOT NULL, 
    booking_id UUID NOT NULL, 
    method payment_method NOT NULL, 
    amount NUMERIC(12, 2) NOT NULL, 
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL, 
    provider_reference VARCHAR(100), 
    paid_at TIMESTAMP WITH TIME ZONE, 
    notes VARCHAR(500), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT fk_payments_booking_id FOREIGN KEY(booking_id) REFERENCES bookings (id) ON DELETE CASCADE
);

CREATE INDEX ix_payments_booking_id ON payments (booking_id);

CREATE INDEX ix_payments_method ON payments (method);

CREATE INDEX ix_payments_provider_reference ON payments (provider_reference);

CREATE TYPE proof_verification_status AS ENUM ('pending', 'verified', 'rejected');

CREATE TABLE payment_proofs (
    id UUID NOT NULL, 
    payment_id UUID NOT NULL, 
    file_path VARCHAR(500) NOT NULL, 
    original_filename VARCHAR(255), 
    content_type VARCHAR(100), 
    verification_status proof_verification_status DEFAULT 'pending' NOT NULL, 
    verified_by_admin_id UUID, 
    verified_at TIMESTAMP WITH TIME ZONE, 
    rejection_reason VARCHAR(500), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT fk_payment_proofs_payment_id FOREIGN KEY(payment_id) REFERENCES payments (id) ON DELETE CASCADE, 
    CONSTRAINT fk_payment_proofs_verified_by_admin_id FOREIGN KEY(verified_by_admin_id) REFERENCES admins (id) ON DELETE SET NULL
);

CREATE INDEX ix_payment_proofs_payment_id ON payment_proofs (payment_id);

CREATE INDEX ix_payment_proofs_verification_status ON payment_proofs (verification_status);

CREATE INDEX ix_payment_proofs_verified_by_admin_id ON payment_proofs (verified_by_admin_id);

CREATE TABLE notifications (
    id UUID NOT NULL, 
    guest_id UUID, 
    booking_id UUID, 
    admin_id UUID, 
    channel VARCHAR(30) DEFAULT 'system' NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    body VARCHAR(2000) NOT NULL, 
    is_read BOOLEAN DEFAULT false NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    read_at TIMESTAMP WITH TIME ZONE, 
    PRIMARY KEY (id), 
    CONSTRAINT fk_notifications_guest_id FOREIGN KEY(guest_id) REFERENCES guests (id) ON DELETE CASCADE, 
    CONSTRAINT fk_notifications_booking_id FOREIGN KEY(booking_id) REFERENCES bookings (id) ON DELETE CASCADE, 
    CONSTRAINT fk_notifications_admin_id FOREIGN KEY(admin_id) REFERENCES admins (id) ON DELETE CASCADE
);

CREATE INDEX ix_notifications_is_read ON notifications (is_read);

INSERT INTO alembic_version (version_num) VALUES ('0001_init') RETURNING alembic_version.version_num;

COMMIT;

