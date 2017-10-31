drop table if exists dim_user;

create table dim_user
(
    account_id serial PRIMARY KEY
    ,username varchar(50)
    ,wiki_url varchar(50)
)

