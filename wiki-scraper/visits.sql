CREATE TABLE IF NOT EXISTS visits(
    band_link TEXT PRIMARY KEY
    ,band_name TEXT
    ,visited INT
);

INSERT INTO visits(
    band_link
    ,band_name
    ,visited
) values (
    '/wiki/Audioslave'
    ,'Audioslave'
    ,0
),(
    '/wiki/Red_Hot_Chili_Peppers'
    ,'Red Hot Chili Peppers'
    ,0
),(
    '/wiki/Volbeat'
    ,'Volbeat'
    ,0
)
;

