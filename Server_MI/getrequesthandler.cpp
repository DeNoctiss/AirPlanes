#include "getrequesthandler.h"

GetRequestHandler::GetRequestHandler(QSqlDatabase *db, Request *request):DB_(db),Request_(request)
{
QTextCodec::setCodecForLocale(QTextCodec::codecForName("UTF-8"));
}


QString GetRequestHandler::getRoutesHandler()
{
    QJsonArray routes;
    QSqlQuery* query = new QSqlQuery(*DB_);
    if(query->exec("select Route.id, Route.race, Route.from_, Route.to_, Date.date from Route join Date ON Route.id_date = Date.id;")){
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
    if(query->exec("select * from DataFlight where id_route = "+ idRoute+";")){
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

