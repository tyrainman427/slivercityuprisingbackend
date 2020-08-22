CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table users(
    user_id  uuid DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL UNIQUE,
    email Text NOT NULL ,
    password Text NOT NULL,
    full_name TEXT NOT NULL,
    nickname TEXT,
    birthday Text,
    phone Text,
    profileImg Text,
    street1 Text,
    city Text,
    state Text,
    zipcode Text,
    country Text,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
    date_modified TIMESTAMPTZ,
    PRIMARY KEY (user_id)
);