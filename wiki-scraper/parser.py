import requests
from bs4 import BeautifulSoup
#import urllib 
import sqlite3
import argparse


argparser = argparse.ArgumentParser(description="Normal or Rerun")
argparser.add_argument('--rerun', dest='rerun', action='store_true')

pageURI = 'https://en.wikipedia.org'
conn = sqlite3.connect('parser.db')

curse = conn.cursor()

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
                where band_link = '{}'
                ;
                '''.format(row[0])
            print(sql_s)
            curse.execute(sql_s);
    conn.commit()
    

if __name__ == '__main__':

    args=argparser.parse_args()

    if args.rerun:
        restart()

    quit()

    _toVisit = [
            #'/wiki/Ice_Cube',
            #'/wiki/Audioslave',
            '/wiki/Volbeat',
            #'/wiki/Red_Hot_Chili_Peppers',
            ]


    _visited = []
    Bands = {}

    while len(_toVisit):
        bandRow={}
        print('Visiting ', _toVisit[0])
        bandRow['Band']=_toVisit[0]
        r = requests.get(pageURI+_toVisit[0])
        soup = BeautifulSoup(r.text, 'lxml')
        
        try:
            table = soup.find('table', attrs={'class':'infobox vcard plainlist'})
            if table is None:
                table = soup.find('table', attrs={'class':'infobox biography vcard'})
            content_rows = table.find_all('tr')
        except:
            print("This page doesn't have a cheatsheet")
            _visited.append(_toVisit[0])
            del _toVisit[0]
            continue
        
        cur_th = ''
        for each in content_rows:
            #print(each)
            #print(each.text)
            pair={}
            try_href = False
            if each.th and each.th.text != '':
                print(each.th.text)
                cur_th = each.th.text
                bandRow[cur_th]=[]
                #if each.td:
                    #print("tasda",each.td.text)
                    #bandRow[cur_th].append(each.td.text)
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
                    bandRow[cur_th].append({'Value':text, 'Link':pair[text]})
            elif each.a:
                a_value = soup.find(lambda tag: (tag.name == 'a' 
                    and each.a.text == tag.text),href=True)
                if a_value:
                    pair[each.a.text]=a_value['href']
                else:
                    pair[each.a.text]=None
                print('\t',each.a.text, '----', pair[each.a.text])
                bandRow[cur_th].append({'Value':each.a.text, 'Link':pair[each.a.text]})



        sql_s = '''
            update visits
            set visited = 1
            where band_link = '{}'
            ;
            '''.format(cur_visiting)
        print(sql_s)

        curse.execute(sql_s)
        conn.commit()


        #_visited.append(_toVisit[0])
        #del _toVisit[0]


        if bandRow.get('Associated acts', None) and bandRow.get('Genres', None):
            for act in bandRow['Associated acts']:
                if act['Link'] not in _visited and act['Link'] is not None:
                    print('\tNeed to visit {}'.format(act['Value']))
                    #_toVisit.append(act['Link'])
                    sql_s = '''
                        insert into visits values(
                            band_link
                            ,band_name
                            ,visited
                        )
                        values
                            {}
                            ,{}
                            0
                        ;
                        '''.format(act['Link'], act['Value'])
                    print(sql_s)
                    curse.execute(sql_s)

                elif act['Link'] is None:
                    print("Can't visit", act['Link'])
            conn.commit()


