drop table if exists dim_user cascade;
create table dim_user
(
    id SERIAL
    ,first_name varchar(64)
    ,last_name varchar(64)
    ,email varchar(325) UNIQUE NOT NULL
    ,date_created TIMESTAMP NOT NULL DEFAULT current_timestamp
    ,PRIMARY KEY(id)
);
