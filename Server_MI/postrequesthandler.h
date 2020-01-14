#ifndef POSTREQUESTHANDLER_H
#define POSTREQUESTHANDLER_H

#include <QSqlDatabase>
#include <QSqlQuery>
#include <QtSql>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <request.h>

class PostRequestHandler
{
public:
    PostRequestHandler(QSqlDatabase* db, Request* request);

private:
    QSqlDatabase* DB_;
    Request* Request_;
};

#endif // POSTREQUESTHANDLER_H
