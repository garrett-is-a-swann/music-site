drop table if exists mus.band CASCADE;

create table mus.band
(
    id SERIAL PRIMARY KEY
    ,name varchar(256) UNIQUE NOT NULL
    ,wiki_url varchar(256)
)

