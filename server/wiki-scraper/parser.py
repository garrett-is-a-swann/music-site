#!/usr/bin/python3
import requests
from bs4 import BeautifulSoup
import urllib 
import sqlite3
import argparse
import re
import sys



pageURI = 'https://en.wikipedia.org'
conn = sqlite3.connect('spider.db')

curse = conn.cursor()

def main():
    while True:
        try:
            _toVisit, BAND = curse.execute('''
                                        SELECT
                                            band_link
                                            ,band_name
                                        FROM
                                            visits
                                        WHERE
                                            visited = 0;
                                    ''').fetchone()
        except TypeError as e:
            print(e)
            print("Done!")
            quit()

        bandR={}
        print('Visiting ', _toVisit)
        bandR['Band']=_toVisit
        try:
            r = requests.get(pageURI+_toVisit)
            soup = BeautifulSoup(r.text, 'lxml')
        
            table = soup.find('table', attrs={'class':'infobox vcard plainlist'})
            if table is None:
                table = soup.find('table', attrs={'class':'infobox biography vcard'})
            content_rows = table.find_all('tr')
        except KeyboardInterrupt:
            raise
        except:
            print("This page doesn't have a cheatsheet or can't be opened")
            sql_s = '''
                update visits
                set visited = 1
                where band_link = ?
                ;
                '''
            print(sql_s)
            curse.execute(sql_s, (_toVisit,))
            conn.commit()
            continue
        
        cur_th = ''
        for each in content_rows:
            #print(each)
            #print(each.text)
            pair={}
            try_href = False
            if each.th and each.th.text != '':
                print('TH', each.th.text)
                cur_th = each.th.text
                bandR[cur_th]=[]
                #if each.td:
                    #print("tasda",each.td.text)
                    #bandR[cur_th].append(each.td.text)
            # TODO (Garrett): Add method for scraping bands that don't have a th title box. Case: https://en.wikipedia.org/wiki/True_Symphonic_Rockestra
            if cur_th == '':
                continue
            if each.ul:
                for li in each.ul:
                    if li == '\n':
                        continue
                    text = li.a.text if li.a else li.text
                    a_value = soup.find(lambda tag: (tag.name == 'a' 
                        and text == tag.text),href=True)
                    if a_value:
                        pair[text]=a_value['href']
                    else:
                        pair[text]=None
                    print(text, pair[text])
                    bandR[cur_th].append({'Value':text, 'Link':urllib.parse.unquote(pair[text]) if pair[text] else pair[text]})
            elif each.td:
                for item in each.td:
                    if item.name == u'span':
                        for i in item: # It's loops all the way down. Thanks, Glassjaw editors...
                            if i.name == u'a':
                                print('\n\t\tITEM : ',i.a, '\n\n\n')
                                a_value = soup.find(lambda tag: (tag.name == 'a' 
                                    and i.text == tag.text),href=True)
                                if a_value:
                                    pair[i.text]=a_value['href']
                                else:
                                    pair[i.text]=None
                                print('\t',i.text, '----', pair[i.text])
                                bandR[cur_th].append({'Value':i.text, 'Link':urllib.parse.unquote(pair[i.text])})
                    print('\n\t', type(item), item, '\n\n')
                    if item.name == u'a':
                        print('\n\t\tITEM : ',item.a, '\n\n\n')
                        a_value = soup.find(lambda tag: (tag.name == 'a' 
                            and item.text == tag.text),href=True)
                        if a_value:
                            pair[item.text]=a_value['href']
                        else:
                            pair[item.text]=None
                        print('\t',item.text, '----', pair[item.text])
                        bandR[cur_th].append({'Value':item.text, 'Link':urllib.parse.unquote(pair[item.text])})
            elif each.a and each.a.get('class') and each.a['class'] != 'image':
                print('\n\n',each.a, '\n\n\n')
                a_value = soup.find(lambda tag: (tag.name == 'a' 
                    and each.a.text == tag.text),href=True)
                if a_value:
                    pair[each.a.text]=a_value['href']
                else:
                    pair[each.a.text]=None
                print('\t',each.a.text, '----', pair[each.a.text])
                bandR[cur_th].append({'Value':each.a.text, 'Link':urllib.parse.unquote(pair[each.a.text])})

        print(bandR)
        for row in bandR:
            print(row)
            print('\t', bandR[row])
        print(curse.lastrowid)

        sql_s = '''
            update visits
            set visited = 1
            where band_link = ?
            ;
            '''
        print(sql_s, (_toVisit))
        
        curse.execute(sql_s, (_toVisit,)) # Wait on commit until finished pushing stuff to DB



        if bandR.get('Associated acts', None) and bandR.get('Genres', None):
            for act in bandR['Associated acts']:
                if act['Link'] and act['Link'] is not None:
                    print('\tNeed to visit {}'.format(act['Value']))
                    #_toVisit.append(act['Link'])
                    sql_s = '''
                        INSERT INTO visits(
                            band_link
                            ,band_name
                            ,visited
                        )
                        SELECT
                            * 
                        FROM (
                            SELECT 
                                ? L
                                ,?,
                                0
                        ) N 
                        WHERE 
                            NOT EXISTS (
                                SELECT 
                                    1 
                                FROM 
                                    visits 
                                WHERE 
                                    L = band_link);
                        '''
                    print(sql_s)
                    curse.execute(sql_s, (act['Link'], act['Value']))
                    if( curse.lastrowid ):
                        print('Submitted correctly: {}'.format(curse.lastrowid))

                    
                elif act['Link'] is None:
                    print("Can't visit", act['Link'])

        sql_s = '''
            INSERT OR REPLACE INTO raw_data(
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
            SELECT
                * 
            FROM (
                SELECT 
                    ? N
                    ,?
                    ,?
                    ,?
                    ,?
                    ,?
                    ,?
                    ,?
                    ,?
                    ,0
                    ,datetime(strftime('%s', 'now'),'unixepoch')
            ) Nu
            WHERE 
                NOT EXISTS (
                    SELECT 
                        1 
                    FROM 
                        raw_data
                    WHERE 
                        N = band_name);
            '''
        print(sql_s)
        curse.execute(sql_s, 
        (BAND
        , '|'.join(
            a['Value'] for a in bandR['Origin']) if bandR.get('Origin') else ''
        , '|'.join(
            a['Value'] for a in bandR['Genres']) if bandR.get('Genres') else ''
        , '|'.join(
            str(a['Link']) for a in bandR['Genres']) if bandR.get('Genres') else ''
        , '|'.join(
            a['Value'] for a in bandR['Years active']) if bandR.get('Years active') else ''
        , '|'.join(
            a['Value'] for a in bandR['Associated acts']) if bandR.get('Associated acts') else ''
        , '|'.join(
            a['Value'] for a in bandR['Website']) if bandR.get('Website') else ''
        , '|'.join(
            a['Value'] for a in bandR['Members']) if bandR.get('Members') else ''
        , '|'.join(
            a['Value'] for a in bandR['Past members']) if bandR.get('Past members') else ''))
        conn.commit()


def restart():
    for row in curse.execute('''
    Select *
    from visits
    ;
    '''):
        print(row)
        if row[2] == 1:
            sql_s = '''
                update visits
                set visited = 0
                where band_link = "{}"
                ;
                '''.format(row[0])
            print(sql_s)
            curse.execute(sql_s);
    conn.commit()


def requester9000(line, append=''):
    try: #roflmao
        r = requests.get(pageURI+'/wiki/'+line+append)
        soup = BeautifulSoup(r.text, 'lxml')
        match = re.search(r'(/wiki/.+)',r.url)
        if not match:
            print("Not a page")
            return None

        # Is useable? 
        table = soup.find('table', attrs={'class':'infobox vcard plainlist'})
        if table is None:
            table = soup.find('table', attrs={'class':'infobox biography vcard'})
        if table is None:
            print("This page doesn't have a cheatsheet.")
            return None
        content_rows = table.find_all('tr')
        print('This page is useable')

        # Get correct name spelling
        heading = soup.find('h1', attrs={'class':'firstHeading'})
        return (match.group(), heading.text, match.group())

    except KeyboardInterrupt:
        raise

    except Exception as e:
        print("This page doesn't have a cheatsheet or can't be opened: \n", e)
        return None


def parseStdin():
    possible_missing = []
    for line in sys.stdin:
        print(line.rstrip())

        bandtup = requester9000(line.rstrip())

        if bandtup == None:
            bandtup = requester9000(line.rstrip(), '_(band)')
        if bandtup == None:
            print('continuing')
            continue

        sql_s = '''
            INSERT INTO visits
            (
                band_link
                ,band_name
                ,visited
            )
            SELECT
                ?
                ,?
                ,0
            where NOT EXISTS (
                SELECT 1 FROM visits WHERE band_link = ?)
            ;
            '''
        print(sql_s, bandtup)
        curse.execute(sql_s, bandtup)
        print(curse.lastrowid)
        conn.commit()

if __name__ == '__main__':
    argparser = argparse.ArgumentParser(description="Normal or Rerun")
    argparser.add_argument('--rerun', dest='rerun', action='store_true')
    args=argparser.parse_args()

    parseStdin()

    if args.rerun:
        restart()

    main()
