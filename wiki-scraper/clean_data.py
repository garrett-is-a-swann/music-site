#!/usr/bin/python3
import psycopg2
import sqlite3
import argparse
import sys

sys.path.append('..')

argparser = argparse.ArgumentParser(description="Normal or Rerun")
argparser.add_argument('--rerun', dest='rerun', action='store_true')
argparser.add_argument('--pg', dest='pconf')

def main(conn_str, args):
    pconn = psycopg2.connect(conn_str)
    pcurse = pconn.cursor()

    lconn = sqlite3.connect('spider.db')
    lcurse = lconn.cursor()

    if args.rerun:
        reset(lconn, lcurse)
    
    while True:
        try:
            sql_s = '''
                select 
                    r.band_name, v.band_link, r.genres, r.genre_links
                from 
                    raw_data r
                    join visits v
                        on v.band_name = r.band_name
                where
                    r.touched = 0
            '''
            band, link, genres, glinks = lcurse.execute(sql_s).fetchone();
            genres = genres.split('|')
            glinks = glinks.split('|')
        except KeyboardInterrupt as e:
            raise Exception(e)
        except:
            break;
        print(sql_s, band, link)
        for gpair in [(genres[i].lower(), glinks[i].lower()) for i in range(len(genres))]:
            print(gpair)
            pcurse.execute('''
                INSERT into dim_genre as dgn
                    (name, wiki_url)
                VALUES
                    (%s, %s)
                ON CONFLICT (name) DO UPDATE
                    SET name = EXCLUDED.name,
                        wiki_url = EXCLUDED.wiki_url
                    WHERE dgn.wiki_url = 'None'
                ''', gpair);
            pconn.commit()

        sql_p = '''
            INSERT into dim_band as dbn
                (name, wiki_url)
            VALUES
                (%s, %s)
            ON CONFLICT (name) DO UPDATE
                SET name = EXCLUDED.name,
                    wiki_url = EXCLUDED.wiki_url
                WHERE dbn.wiki_url = 'None'
            RETURNING id
            ;
            '''
        pcurse.execute(sql_p, (band, link.lower()));
        pconn.commit()

        sql_s = '''
            update raw_data
            set touched = 1
            where band_name = ?
        '''
        lcurse.execute(sql_s, (band,))
        lconn.commit()

    reset(lconn, lcurse)
                
    # Do links
    while True:
        try:
            sql_s = '''
                select 
                    r.band_name, r.genres
                from 
                    raw_data r
                where
                    r.touched = 0
            '''
            band, genres= lcurse.execute(sql_s).fetchone();
            print(sql_s, band)
        except KeyboardInterrupt as e:
            raise Exception(e)
        except:
            break;

        print(genres)
        for bgpair in [(band, genre.lower()) for genre in genres.split('|')]:
            sql_p = '''
                INSERT INTO fct_band_genre
                    (bandid, genreid)
                SELECT
                    b.id, g.id
                FROM 
                    dim_band b,
                    dim_genre g
                WHERE
                    b.name = %s
                    and g.name = %s
                ON CONFLICT (bandid, genreid) DO NOTHING;
            '''
            print(bgpair)
            pcurse.execute(sql_p, bgpair);
        pconn.commit()
        
        sql_s = '''
            update raw_data
            set touched = 1
            where band_name = ?
        '''
        lcurse.execute(sql_s, (band,))
        lconn.commit()

def reset(lconn, lcurse):
    sql_s = '''
        update raw_data
        set touched = 0;
    '''

    print('RESET!!\n',sql_s)
    lcurse.execute(sql_s);
    lconn.commit()


if __name__ == '__main__':
    args=argparser.parse_args()

    with open(args.pconf, 'r') as f:
        conn_str = f.read()
        print(conn_str.split('\n')[0])
        main(conn_str.split('\n')[0], args)
