create table musician (
    musician_key integer NOT NULL PRIMARY KEY
    ,album_key integer NOT NULL
    ,origin_key integer
    ,instrument text[]
    ,UNIQUE(musician_key)
)
;
