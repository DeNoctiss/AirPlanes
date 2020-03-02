import requests
from bs4 import BeautifulSoup
#import psycopg2
import sqlite3
from datetime import datetime
import time


while True:
    #conn = psycopg2.connect(dbname='AirPlane', user='denoctis',
    #                        password='ArchDemons', host='localhost')
    conn = sqlite3.connect ("/home/denoctis/AirPlane")
    cursor = conn.cursor()

    preficsUrl = 'https://ru.flightaware.com/live/fleet/'

    preficsSource = requests.get(preficsUrl)
    mainPreficsText = preficsSource.text
    PreficsSoup = BeautifulSoup(mainPreficsText, 'html.parser')

    preficsTable = PreficsSoup.find('table', {'class': 'prettyTable'})
    preficsLinks = preficsTable.findAll('a')
    preficsLinks = preficsLinks[:5:]

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
            today = datetime.now()
            today = str(datetime.date(today))
            dateId = 0
            cursor.execute("select count(*) from Date where Date = "+ "'"+today+"';")
            for row in cursor.fetchone():
                if row == 0:
                    cursor.execute("select count(id) from Date;")
                    for roww in cursor.fetchone():
                        dateId = roww+1
                        #print(dateId)
                        cursor.execute("insert into Date values("+str(dateId)+",'"+today+"');")
                        conn.commit()
                else:
                    cursor.execute("select id from Date where Date = '"+today+"';")
                    for roww in cursor.fetchone():
                        dateId = roww
            print(dateId)
            print(routeData[2].text + '->' + routeData[3].text)
            from_ = routeData[2].text.replace("'",'')
            to_ = routeData[3].text.replace("'",'')
            race = routeData[0].find('a').text
            print(race)
            idRoute = 0
            cursor.execute("select count(id) from Route where race = '"+race+"';")
            for row in cursor.fetchone():
                if row == 0:
                    cursor.execute("select count(id) from Route;")
                    for roww in cursor.fetchone():
                        idRoute = roww+1
                        cursor.execute("insert into Route values("+str(idRoute)+",'"+race+"','"+from_+"','"+to_+"',"+str(dateId)+");")
                        conn.commit()
                else:
                    cursor.execute("select id from Route where race = '"+race+"';")
                    for roww in cursor.fetchone():
                        idRoute = roww
            print(idRoute)
            flightDataUrl = 'https://ru.flightaware.com' + routeData[0].find('a').get('href') + '/tracklog'
            flightDataSource = requests.get(flightDataUrl)
            maintFlightDataText = flightDataSource.text
            flightDataSoup = BeautifulSoup(maintFlightDataText, 'html.parser')
            dateConteiner = flightDataSoup.find('div', {'class': 'row'})
            date = dateConteiner.findAll('a')[1].text.split(' ')
            date = date[4] + ' ' + date[5] + ' ' + date[6]
            #print(date)
            dataTable = flightDataSoup.find('table', {'id': 'tracklogTable'})
            dataRows = dataTable.findAll('tr')
            dataRows = dataRows[1::]
            number = 1
            cursor.execute("select count(*) from DataFlight where id_route="+str(idRoute)+" ;")
            for row in cursor.fetchone():
                if row != 0:
                    dataRows = dataRows[row+1::]
                    number = row+1 
            for dataRow in dataRows:
                tds = dataRow.findAll('td');
                
                data = dataRow.findAll('span', {'class': 'show-for-medium-up'})
                if len(data) == 5:
                    direction = tds[3].text.split(' ')[1]
                    direction = direction[:-1:]
                    print(direction)
                    altitude = data[3].text.split(',')
                    if len(altitude) == 2:
                        altitude = altitude[0]+altitude[1]
                    else:
                        altitude = altitude[0]
                    if altitude == '':
                        altitude = "0"
                    latitude = data[1].text
                    longitude = data[2].text
                    total_intensity = 0
                    print (latitude + ' ' + longitude + ' ' + altitude + ' ' + str(number));
                    cursor.execute("insert into DataFlight values("+latitude+","+longitude+","+altitude+","+str(total_intensity)+","+direction+","+str(idRoute)+","+str(number)+");")
                    conn.commit()
                    number = number + 1
            print('\n')
    conn.close()
    time.sleep(3600)
