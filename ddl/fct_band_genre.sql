drop table if exists fct_band_genre CASCADE;

create table fct_band_genre
(
    bandid INT NOT NULL
    ,genreid INT NOT NULL
    ,UNIQUE (bandid, genreid)
    ,FOREIGN KEY (bandid) REFERENCES dim_band (id)
    ,FOREIGN KEY (genreid) REFERENCES dim_genre (id)
)

