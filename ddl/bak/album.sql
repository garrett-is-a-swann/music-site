create table album (
    album_key integer NOT NULL PRIMARY KEY
    ,band_key integer NOT NULL
    ,name varchar(50) NOT NULL
    ,musician_keys int[] NOT NULL
    ,release_date date
    ,genre text[]
    ,UNIQUE(album_key)
)
;
