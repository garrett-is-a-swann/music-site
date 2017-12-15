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



drop table if exists user_list;
create table user_list
(
    userid INT NOT NULL
    --, id int NOT NULL
    ,name VARCHAR(64) NOT NULL
    ,date_created timestamp NOT NULL DEFAULT current_timestamp
    
    ,PRIMARY KEY (userid, name)
    ,FOREIGN KEY (userid) REFERENCES dim_user (id)
)
;

drop table if exists list_entry;
create table list_entry
(
    listname varchar(64) NOT NULL
    ,bandid int NOT NULL
    ,count int NOT NULL CHECK (count > 0)

    ,FOREIGN KEY (bandid) REFERENCES dim_band (id)
)
;
SELECT *
FROM (
    SELECT 
        ROW_NUMBER() OVER(PARTITION BY u.userid ORDER BY u.date_created) as rowid
        ,u.*
        ,v.*
    FROM user_list u
    ) as f 



/* 

SELECT 
    ROW_NUMBER() OVER(PARTITION BY u.id ORDER BY u.date_created)
    ,v.name      
    ,v.id
FROM dim_user u
    ,
    ( 
        values ('MEME TABLE', 1)
    ) as v (name, id)


INSERT INTO user_list
(
    id
    ,name
    ,userid
)
    SELECT 
        ROW_NUMBER() OVER(PARTITION BY ID ORDER BY name)
        ,'MEME TABLE'
        ,1
    FROM ,user_list
    WHERE userid = 1
*/



