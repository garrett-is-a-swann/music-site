import requests
from bs4 import BeautifulSoup

pageURI = 'https://en.wikipedia.org/wiki/'

if __name__ == '__main__':

    _toVisit = ['Volbeat', 'Red_Hot_Chili_Peppers']

    _visited = []
    Bands = {}

    while len(_toVisit):
        r = requests.get(pageURI + _toVisit[0] + '_(band)')
        soup = BeautifulSoup(r.text, 'lxml')

        table = soup.find('table', attrs={'class':'infobox vcard plainlist'})
        content_rows = table.find_all('tr')[3:]
        headings = {}
        for tr in content_rows:
            index = ''
            for th in tr.find_all('th'):
                if th.get_text() != '':
                    index = th.get_text()
                    headings[index] = []
            if index != '':
                li = tr.find_all('li')
                if len(li) != 0:
                    for i in li:
                        headings[index].append(i.get_text())
                else:
                    headings[index].append(tr.find('td').get_text())

        Bands[_toVisit[0]] = headings
        _visited.append(_toVisit[0])
        del _toVisit[0]

        print(headings)

        print(headings['Associated acts'])
        for act in headings['Associated acts']:
            print(act)
            if act not in _visited:
                print('Need to visit {}'.format(act))
                _toVisit.append(act)
                
            
