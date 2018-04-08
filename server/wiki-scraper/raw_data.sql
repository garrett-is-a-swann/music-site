DROP TABLE IF EXISTS raw_data;
CREATE TABLE IF NOT EXISTS raw_data(
    band_name TEXT PRIMARY KEY
    ,origin TEXT
    ,genres TEXT
    ,genre_links TEXT
    ,years_active TEXT
    ,associated_acts TEXT
    ,website TEXT
    ,members TEXT
    ,past_members TEXT
    ,touched BOOLEAN
    ,found_time DATETIME
);



/*insert into 
    raw_data(
        band_name
        ,origin
        ,genres
        ,genre_links
        ,years_active
        ,associated_acts
        ,website
        ,members
        ,past_members
        ,touched
        ,found_time
    ) 
    select 
        band_name
        ,origin
        ,genres
        ,genre_links
        ,years_active
        ,associated_acts
        ,website
        ,members
        ,past_members
        ,0
        ,datetime(strftime('%s', 'now'),'unixepoch')
    from 
        old_raw;

select band_name, touched, found_time from raw_data limit 10;
*/
