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
    QString limit = Request_->GetCgi("limit");
    QString offset = Request_->GetCgi("offset");
    if(query->exec("select * from DataFlight where id_route = "+ idRoute+" order by number limit "+limit+" offset "+offset+";")){
        while (query->next()) {
            QJsonObject data;
            data["latitude"]=query->value(0).toString();
            data["longitude"]=query->value(1).toString();
            data["altitude"]=query->value(2).toInt();
            data["total_intensity"]=query->value(3).toInt();
            data["direction"]=query->value(4).toInt();
            data["time"]=query->value(7).toString();
            data["Bx"]=query->value(8).toInt();
            data["By"]=query->value(9).toInt();
            data["Bz"]=query->value(10).toInt();
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
    QJsonArray x;
    QJsonArray y;
    QJsonArray z;
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
            QJsonObject tot_ = val.value("total-intensity").toObject();
            QJsonObject Bx_ = val.value("north-intensity").toObject();
            QJsonObject By_ = val.value("east-intensity").toObject();
            QJsonObject Bz_ = val.value("vertical-intensity").toObject();
            int tot = tot_.value("value").toInt();
            int Bx = Bx_.value("value").toInt();
            int By = By_.value("value").toInt();
            int Bz = Bz_.value("value").toInt();
            QSqlQuery* qry = new QSqlQuery(*DB_);
            qry->exec("update DataFlight set total_intensity ="+QString::number(tot)+","+" Bx = "+QString::number(Bx)+","+" By = "+QString::number(By)+","+" Bz ="+QString::number(Bz)+" where latitude = "+latitude+" and longitude = "+longitude+" and altitude = "+altitude+" ;");
            //qry->exec("update DataFlight set Bx ="+QString::number(Bx)+" where latitude = "+latitude+" and longitude = "+longitude+" and altitude = "+altitude+" ;");
            //qry->exec("update DataFlight set By ="+QString::number(By)+" where latitude = "+latitude+" and longitude = "+longitude+" and altitude = "+altitude+" ;");
            //qry->exec("update DataFlight set Bz ="+QString::number(Bz)+" where latitude = "+latitude+" and longitude = "+longitude+" and altitude = "+altitude+" ;");
            total.append(tot);
            x.append(Bx);
            y.append(By);
            z.append(Bz);
            delete qry;
        }
    }

    delete query;
    QJsonObject obj;
    obj["Bt"]=total;
    obj["Bx"]=x;
    obj["By"]=y;
    obj["Bz"]=z;
    //obj["ans"]="ok";
    QJsonDocument doc;
    doc.setObject(obj);
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

QString GetRequestHandler::getDates()
{
    QJsonArray disableDate;
    QVector<QDateTime> dates;
    QSqlQuery* query = new QSqlQuery(*DB_);
    if(query->exec("select date from date order by date;")){
        while (query->next()) {
            QString date = query->value(0).toString();
            dates.append(QDateTime::fromString(date,"yyyy-MM-dd"));
        }
    }
    QDateTime first = dates[0].addDays(1);
    QDateTime last = dates[dates.size()-1];
    while (first < last) {
        bool f=true;
        for(size_t i=0; i<dates.size();i++){
            if (first==dates[i]) {
                f=false;
            }
        }
        if(f){
            disableDate.append(first.toString("yyyy-MM-dd"));
        }
        first=first.addDays(1);
    }
    QJsonObject obj;
    obj["disableDate"]=disableDate;
    obj["first"]=dates[0].toString("yyyy-MM-dd");
    obj["last"]=last.toString("yyyy-MM-dd");
    QJsonDocument doc;
    doc.setObject(obj);
    delete query;
    return QString(doc.toJson());
}

QString GetRequestHandler::check()
{
    QString html ="";
    QVector<QString> ids;
    QVector<QString> dateIds;
    QVector<QString> dates;
    QSqlQuery *query = new QSqlQuery(*DB_);
    if(query->exec("select id, date_id  from route order by id;")){
        while (query->next()) {
            ids.append(query->value(0).toString());
            dateIds.append(query->value(1).toString());
        }
    }

    for(size_t i=0; i<dateIds.size();i++){
        if(query->exec("select date from date where id = "+dateIds[i]+";")){
            while (query->next()) {
                dates.append(query->value(0).toString());
            }
        }
    }

    for(size_t i=0; i<ids.size();i++){
        DB_->transaction();
        if(query->exec("select latitude, longitude, altitude from dataflight where total_intensity = 0 and id_route = "+ids[i]+";")){
            while (query->next()) {
                QString latitude =query->value(0).toString();
                QString longitude =query->value(1).toString();
                QString altitude =query->value(2).toString();
                float lat = latitude.toFloat();
                float lon = longitude.toFloat();
                float alt = altitude.toInt();
                alt/=1000;

                QNetworkRequest request(QUrl("http://geomag.bgs.ac.uk/web_service/GMModels/wmm/2020v2?latitude="+query->value(0).toString()+"&longitude="+query->value(1).toString()+"&altitude="+QString::number(alt)+"&date="+dates[i]+"&format=json"));
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
                QJsonObject tot_ = val.value("total-intensity").toObject();
                QJsonObject Bx_ = val.value("north-intensity").toObject();
                QJsonObject By_ = val.value("east-intensity").toObject();
                QJsonObject Bz_ = val.value("vertical-intensity").toObject();
                int tot = tot_.value("value").toInt();
                int Bx = Bx_.value("value").toInt();
                int By = By_.value("value").toInt();
                int Bz = Bz_.value("value").toInt();
                QSqlQuery* qry = new QSqlQuery(*DB_);
                qry->exec("update DataFlight set total_intensity ="+QString::number(tot)+","+" Bx = "+QString::number(Bx)+","+" By = "+QString::number(By)+","+" Bz ="+QString::number(Bz)+" where latitude = "+latitude+" and longitude = "+longitude+" and altitude = "+altitude+" ;");
                //qry->exec("update DataFlight set Bx ="+QString::number(Bx)+" where latitude = "+latitude+" and longitude = "+longitude+" and altitude = "+altitude+" ;");
                //qry->exec("update DataFlight set By ="+QString::number(By)+" where latitude = "+latitude+" and longitude = "+longitude+" and altitude = "+altitude+" ;");
                //qry->exec("update DataFlight set Bz ="+QString::number(Bz)+" where latitude = "+latitude+" and longitude = "+longitude+" and altitude = "+altitude+" ;");
                delete qry;
            }
        }
        DB_->commit();
    }

    delete query;
    QJsonObject obj;
    obj["answer"]="OK";
    QJsonDocument doc;
    doc.setObject(obj);
    return QString(doc.toJson());
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

