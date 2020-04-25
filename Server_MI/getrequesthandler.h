#ifndef GETREQUESTHANDLER_H
#define GETREQUESTHANDLER_H


#include <QSqlDatabase>
#include <QSqlQuery>
#include <QtSql>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <request.h>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QDebug>


class GetRequestHandler: public QObject
{
    Q_OBJECT
public:
    GetRequestHandler(QSqlDatabase* db, Request* request);
    QString getRoutesHandler();
    QString getDataFlightHendler();
    QString getTotal();
    QString getRoutesDay();
    QString getDates();
    QString test();

private slots:
    void answer(QNetworkReply *answer);
private:
    QSqlDatabase* DB_;
    Request* Request_;
    QNetworkAccessManager manager;
};

#endif // GETREQUESTHANDLER_H
