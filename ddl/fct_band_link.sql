drop table if exists fct_band_link CASCADE;

create table fct_band_link
(
    from_name varchar(256) NOT NULL
    ,to_name varchar(256) NOT NULL
)

