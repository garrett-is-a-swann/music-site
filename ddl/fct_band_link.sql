drop table if exists fct_band_link;

create table fct_band_link
(
    from_name varchar(50) NOT NULL
    ,to_name varchar(50) NOT NULL
    ,FOREIGN KEY (from_name) REFERENCES dim_band(name)
)

