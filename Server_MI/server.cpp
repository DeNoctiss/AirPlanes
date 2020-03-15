#include "server.h"

Server::Server(QObject* parent): QTcpServer (parent), ThreadPool(new QThreadPool(this))
{
    ThreadPool->setMaxThreadCount(1);
    //qDebug() << ThreadPool->maxThreadCount();
    DB_= QSqlDatabase::addDatabase("QSQLITE");
    DB_.setDatabaseName("AirPlane");

    DB_.setHostName("91.228.154.218");
    if(DB_.open()){
        qDebug() << "Db open";
    }
    else {
        qDebug() << "NO";
    }
}

Server::~Server(){

}

void Server::StartServer(){
    if(this->listen(QHostAddress::Any,5555)){
        qDebug() << "listen";
    }
    else {
        qDebug() << "not listen";
    }
}

void Server::incomingConnection(qintptr socketDescriptor){
    RequestProcessing* requestProcessing = new RequestProcessing(socketDescriptor,&DB_);
    ThreadPool->start(requestProcessing);
}
