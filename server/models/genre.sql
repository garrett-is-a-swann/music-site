drop table if exists mus.genre CASCADE;

create table mus.genre
(
    id SERIAL PRIMARY KEY
    ,name varchar(256) UNIQUE NOT NULL
    ,wiki_url varchar(256) -- CAN BE 'none'
)
