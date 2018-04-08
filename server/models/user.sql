DROP TABLE IF EXISTS wau.user CASCADE;
CREATE TABLE wau.user
(
    id SERIAL PRIMARY KEY
    ,username varchar(64) UNIQUE NOT null
    ,salt varchar(64) NOT null
    ,hash varchar(256) NOT null
    ,first_name TEXT
    ,last_name TEXT
    ,email varchar(325)
    ,email_validated boolean NOT null default false
    ,date_created TIMESTAMP NOT null default current_timestamp
    ,last_login TIMESTAMP NOT null default current_timestamp
);
DROP INDEX IF EXISTS user_email_idx CASCADE; --Just in case.
CREATE UNIQUE INDEX user_email_idx ON wau.user (email) WHERE email_validated = true;
