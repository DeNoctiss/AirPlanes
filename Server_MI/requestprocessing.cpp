#include "requestprocessing.h"

RequestProcessing::RequestProcessing(qintptr socket_id, QSqlDatabase*  db): Socket_id(socket_id),DB_(db){
    qDebug() << "client "+ QString::number(socket_id) +" connected";
    QTextCodec::setCodecForLocale(QTextCodec::codecForName("UTF-8"));
}

void RequestProcessing::run(){
    Socket_ = new QTcpSocket;
    Socket_->setSocketDescriptor(Socket_id);
    Socket_->waitForReadyRead(500);
    Responce();
    Socket_->waitForBytesWritten(500);
    //Socket_->disconnectFromHost();
    Socket_->close();
    Socket_->deleteLater();
    delete Socket_;
}


void RequestProcessing::Responce(){
    QString ask(Socket_->readAll());
    if(ask.isEmpty()) return;
    //qDebug() << ask;
    Request_=new Request(ask);
    if(Request_->GetType()=="GET"){
        GetRequest();
    }
    if(Request_->GetType()=="POST"){
        PostRequest();
    }
}

void RequestProcessing::GetRequest(){
    GetRequestHandler handler(DB_,Request_);
    QString response;
    qDebug() << Request_->GetPath() << " client " << Socket_id;
    if(Request_->GetPath()=="/routes.json")
        response=handler.getRoutesHandler();
    if(Request_->GetPath()=="/dataflight.json")
        response=handler.getDataFlightHendler();
    if(response.isEmpty()){
        Socket_->write("HTTP/1.1 404 \r\n\r\nBad request");
    }
    else {
        response ="HTTP/1.1 200 OK \r\nContent-Type: application/json\r\n\r\n" + response;
        Socket_->write(response.toLocal8Bit());
    }

}

void RequestProcessing::PostRequest(){
    PostRequestHandler handler(DB_,Request_);
    QString response;
    qDebug() << Request_->GetPath() << " client " << Socket_id;
    if(response.isEmpty()){
        Socket_->write("HTTP/1.1 404 \r\n\r\nBad request");
    }
    else {
        response ="HTTP/1.1 200 OK \r\nContent-Type: application/json\r\n\r\n" + response;
        Socket_->write(response.toLocal8Bit());
    }
}

RequestProcessing::~RequestProcessing(){

}
