#include "getrequesthandler.h"

GetRequestHandler::GetRequestHandler(QSqlDatabase *db, Request *request):DB_(db),Request_(request)
{
    QTextCodec::setCodecForLocale(QTextCodec::codecForName("UTF-8"));

}


QString GetRequestHandler::getRoutesHandler()
{
    QJsonArray routes;
    QSqlQuery* query = new QSqlQuery(*DB_);
    if(query->exec("select Route.id, Route.race, Route.from_, Route.to_, Date.date from Route join Date ON Route.date_id = Date.id;")){
        while (query->next()) {
            QJsonObject route;
            route["id"]=query->value(0).toString();
            route["race"]=query->value(1).toString();
            route["from"]=query->value(2).toString();
            route["to"]= query->value(3).toString();
            route["date"]=query->value(4).toString();
            routes.append(route);

        }
    }
    QJsonDocument doc;
    doc.setArray(routes);
    delete  query;
    return  QString(doc.toJson());
}

QString GetRequestHandler::getDataFlightHendler()
{
    QJsonArray dataArray;
    QSqlQuery* query = new QSqlQuery(*DB_);
    QString idRoute = Request_->GetCgi("id");
    if(query->exec("select * from DataFlight where id_route = "+ idRoute+" order by number;")){
        int count = 1;
        while (query->next()) {
            QJsonObject data;
            data["latitude"]=query->value(0).toString();
            data["longitude"]=query->value(1).toString();
            data["altitude"]=query->value(2).toInt();
            data["total_intensity"]=query->value(3).toInt();
            data["direction"]=query->value(4).toInt();
            dataArray.append(data);

        }
    }
    QJsonDocument doc;
    doc.setArray(dataArray);
    delete query;
    return QString(doc.toJson());

}

QString GetRequestHandler::getTotal()
{
    QString html ="";
    QJsonArray total;
    QString idRoute = Request_->GetCgi("id");
    QString date = Request_->GetCgi("date");
    QSqlQuery* query = new QSqlQuery(*DB_);
    if(query->exec("select * from DataFlight where id_route = "+idRoute+" order by number;")){
        while (query->next()) {
            QString latitude =query->value(0).toString();
            QString longitude =query->value(1).toString();
            QString altitude =query->value(2).toString();
            float lat = latitude.toFloat();
            float lon = longitude.toFloat();
            float alt = altitude.toInt();
            alt/=1000;

            QNetworkRequest request(QUrl("http://geomag.bgs.ac.uk/web_service/GMModels/wmm/2020v2?latitude="+latitude+"&longitude="+longitude+"&altitude="+QString::number(alt)+"&date="+date+"&format=json"));
            request.setAttribute(QNetworkRequest::FollowRedirectsAttribute, true);

            QNetworkReply *response = manager.get(request);

            QEventLoop event;
            connect(response,SIGNAL(finished()),&event,SLOT(quit()));
            event.exec();

            html = response->readAll();
            QJsonDocument json = QJsonDocument::fromJson(html.toUtf8());
            QJsonObject obj = json.object();
            QJsonObject res = obj.value("geomagnetic-field-model-result").toObject();
            QJsonObject val = res.value("field-value").toObject();
            QJsonObject tott = val.value("total-intensity").toObject();
            int tot = tott.value("value").toInt();
            QSqlQuery* qry = new QSqlQuery(*DB_);
            qry->exec("update DataFlight set total_intensity ="+QString::number(tot)+" where latitude = "+latitude+" and longitude = "+longitude+" and altitude = "+altitude+" ;");
            total.append(tot);
            delete qry;
        }
    }

    delete query;
    QJsonDocument doc;
    doc.setArray(total);
    return QString(doc.toJson());
}

QString GetRequestHandler::getRoutesDay()
{
    QJsonArray routes;
    QSqlQuery* query = new QSqlQuery(*DB_);
    QString date = Request_->GetCgi("date");
    if(query->exec("select Route.id, Route.race, Route.from_, Route.to_, Date.date from Route join Date ON Date.date = '"+date+"' where date.id = route.date_id;")){
        while (query->next()) {
            QJsonObject route;
            route["id"]=query->value(0).toString();
            route["race"]=query->value(1).toString();
            route["from"]=query->value(2).toString();
            route["to"]= query->value(3).toString();
            route["date"]=query->value(4).toString();
            routes.append(route);

        }
    }
    QJsonDocument doc;
    doc.setArray(routes);
    delete  query;
    return  QString(doc.toJson());
}

QString GetRequestHandler::test()
{
    QJsonArray tests;
    QSqlQuery* query = new QSqlQuery(*DB_);
    if(query->exec("select * from stest;")){
        while (query->next()) {
            QJsonObject test;
            test["lol"] = query->value(0).toString();
            tests.prepend(test);
        }
    }
    QJsonDocument doc;
    doc.setArray(tests);
    delete query;
    return QString(doc.toJson());
}

void GetRequestHandler::answer(QNetworkReply *answer)
{
    qDebug() << answer->readAll();
}

