drop table if exists fct_user_band;

create table fct_user_band
(
    account_id BIGINT
    ,tag_id BIGINT NOT NULL
    ,band_name varchar(50) 
    ,date_added timestamp NOT NULL

    ,FOREIGN KEY (account_id) REFERENCES dim_user (account_id)
    ,FOREIGN KEY (band_name) REFERENCES dim_band (name)
)
;
