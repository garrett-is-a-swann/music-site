/*
DROP TABLE IF EXISTS wau.lobbyuser CASCADE;
CREATE TABLE wau.lobbyuser
(
    lid integer REFERENCES wau.lobby(id)
        ON DELETE CASCADE
    ,uid integer REFERENCES wau.user(id)
    ,first_name varchar(12) default null
    ,last_name varchar(12) default null
    ,PRIMARY KEY (lid, uid)
    --,FOREIGN KEY (lid) REFERENCES wau.lobby (id)
    --,FOREIGN KEY (uid) REFERENCES wau.user (id)
);
*/

CREATE OR REPLACE FUNCTION checkExists() RETURNS TRIGGER AS $$
    BEGIN
        -- If a lobby host leaves a lobby
            -- Remove all users from a lobby
            -- Delete lobby.
        IF (TG_OP = 'DELETE') THEN
            DELETE FROM wau.lobby l
            WHERE l.id = OLD.lid
                and l.hostid = OLD.uid
                and l.date_started is null;

            IF FOUND THEN 
                RAISE NOTICE 'DELETING Lobby[%] Hostid<%>', OLD.lid, OLD.uid;
            END IF;

            RETURN OLD;
        ELSE
            RAISE EXCEPTION 'ERROR: Somehow checkExists() attached to wau.lobbyuser was called on NOT delete';
            RETURN NULL;
        END IF;
    END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_lobby_abandonment ON wau.lobbyuser;
CREATE TRIGGER check_lobby_abandonment 
AFTER DELETE ON wau.lobbyuser
    FOR EACH ROW EXECUTE PROCEDURE checkExists();
