drop table if exists fct_user_band;

create table fct_user_band
(
    userid INT NOT NULL
    ,bandid INT  NOT NULL
    ,date_added timestamp NOT NULL

    ,FOREIGN KEY (userid) REFERENCES dim_user (id)
    ,FOREIGN KEY (bandid) REFERENCES dim_band (id)
)
;
