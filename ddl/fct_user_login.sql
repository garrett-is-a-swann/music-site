drop table if exists fct_user_login;
create table fct_user_login
(
    id SERIAL
    ,username varchar(64) UNIQUE NOT NULL
    ,password_salt varchar(64) NOT NULL
    ,password_hash varchar(256) NOT NULL
    ,user_id integer NOT NULL
    ,permission smallint NOT NULL
    ,date_created TIMESTAMP NOT NULL
    ,PRIMARY KEY(id)
    ,FOREIGN KEY(user_id) REFERENCES dim_user (id)
);
