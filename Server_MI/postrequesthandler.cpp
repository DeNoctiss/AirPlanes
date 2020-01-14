#include "postrequesthandler.h"

PostRequestHandler::PostRequestHandler(QSqlDatabase *db, Request *request):DB_(db),Request_(request)
{
    QTextCodec::setCodecForLocale(QTextCodec::codecForName("UTF-8"));
}

