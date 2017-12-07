drop table if exists fct_user_band_table CASCADE;

create table fct_user_band_table
(
    tag_id SERIAL NOT NULL
    ,account_id INT 
    ,tag_name varchar(50)
    
    ,PRIMARY KEY (tag_id, account_id)
    ,FOREIGN KEY (account_id) REFERENCES dim_user (account_id)
)
;
