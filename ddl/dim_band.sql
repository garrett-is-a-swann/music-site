drop table if exists dim_band CASCADE;

create table dim_band
(
    id SERIAL PRIMARY KEY
    ,name varchar(256) UNIQUE NOT NULL
    ,wiki_url varchar(256) UNIQUE
)

