create table band (
    band_key integer NOT NULL PRIMARY KEY
    ,name varchar(50) NOT NULL
    ,origin_key integer
    ,genre text[]
    ,UNIQUE(band_key)
)
;
