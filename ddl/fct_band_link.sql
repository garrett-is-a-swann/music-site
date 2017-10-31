drop table if exists dim_band;

create table dim_band
(
    name varchar(50) primary key
    ,genre varchar(50)
    ,wiki_url varchar(50)
)

