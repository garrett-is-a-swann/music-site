drop table if exists dim_user;

create table dim_user
(
    account_id BIGSERIAL
    ,username varchar(50) UNIQUE NOT NULL
    ,email varchar(256) UNIQUE NOT NULL
    ,password varchar(256) NOT NULL
    ,date_created TIMESTAMP NOT NULL
    ,PRIMARY KEY(account_id)
)

