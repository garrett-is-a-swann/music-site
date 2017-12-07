drop table if exists fct_band_genre CASCADE;

create table fct_band_genre
(
    bandid INT NOT NULL
    ,genreid INT NOT NULL
    ,UNIQUE (bandid, genreid)
)

