drop table if exists dim_user cascade;
create table dim_user
(
    id SERIAL
    ,first_name varchar(50)
    ,last_name varchar(256)
    ,email varchar(325) UNIQUE NOT NULL
    ,date_created TIMESTAMP NOT NULL
    ,PRIMARY KEY(id)
);
