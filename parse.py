import requests
from bs4 import BeautifulSoup
import psycopg2

conn = psycopg2.connect(dbname='AirPlaneTest', user='denoctis',
                        password='ArchDemons', host='localhost')
cursor = conn.cursor()

preficsUrl = 'https://ru.flightaware.com/live/fleet/'

preficsSource = requests.get(preficsUrl)
mainPreficsText = preficsSource.text
PreficsSoup = BeautifulSoup(mainPreficsText, 'html.parser')

preficsTable = PreficsSoup.find('table', {'class': 'prettyTable'})
preficsLinks = preficsTable.findAll('a')

for prefLink in preficsLinks:
    routeUrl = 'https://ru.flightaware.com'+prefLink.get('href')
    routeSource = requests.get(routeUrl)
    mainRouteText = routeSource.text
    routeSoup = BeautifulSoup(mainRouteText, 'html.parser')
    routeTable = routeSoup.find('table', {'class': 'prettyTable'})
    routs = routeTable.findAll('tr')
    routs = routs[2::]
    for route in routs:
        routeData = route.findAll('td')
        print(routeData[2].text + '->' + routeData[3].text)
        flightDataUrl = 'https://ru.flightaware.com' + routeData[0].find('a').get('href') + '/tracklog'
        flightDataSource = requests.get(flightDataUrl)
        maintFlightDataText = flightDataSource.text
        flightDataSoup = BeautifulSoup(maintFlightDataText, 'html.parser')
        dateConteiner = flightDataSoup.find('div', {'class': 'row'})
        date = dateConteiner.findAll('a')[1].text.split(' ')
        date = date[4] + ' ' + date[5] + ' ' + date[6]
        print(date)
        dataTable = flightDataSoup.find('table', {'id': 'tracklogTable'})
        dataRows = dataTable.findAll('tr')
        for dataRow in dataRows:
            data = dataRow.findAll('span', {'class': 'show-for-medium-up'})
            if len(data) == 5:
                latitude = data[3].text.split(',')
                if len(latitude) == 2:
                    latitude = latitude[0]+latitude[1]
                else:
                    latitude = latitude[0]
                print (data[1].text + ' ' + data[2].text + ' ' + latitude)
        print('\n')
