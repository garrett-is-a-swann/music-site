create table location (
    location_key integer NOT NULL PRIMARY KEY
    ,city varchar(50)
    ,state varchar(50)
    ,country varchar(50)
    ,UNIQUE(location_key)
)
;
