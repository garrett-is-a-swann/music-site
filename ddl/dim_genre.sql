drop table if exists dim_genre CASCADE;

create table dim_genre
(
    id SERIAL PRIMARY KEY
    ,name varchar(256) UNIQUE NOT NULL
    ,wiki_url varchar(256)
)
