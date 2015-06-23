 #!/user/bin/python
import sys
import azure
import socket
from random import randint,randrange,uniform

from azure.servicebus import (
  _service_bus_error_handler
  )

from azure.servicebus.servicebusservice import (
  ServiceBusService,
  ServiceBusSASAuthentication
  )

from azure.http import (
  HTTPRequest,
  HTTPError
  )

from azure.http.httpclient import _HTTPClient

class EventHubClient(object):

  def sendMessage(self,body,partition):
    eventHubHost = "hackathons-ns.servicebus.windows.net"

    httpclient = _HTTPClient(service_instance=self)

    sasKeyName = ""
    sasKeyValue = ""

    authentication = ServiceBusSASAuthentication(sasKeyName,sasKeyValue)

    request = HTTPRequest()
    request.method = "POST"
    request.host = eventHubHost
    request.protocol_override = "https"
    request.path = "/[eventhubdemo]/publishers/" + partition +"/messages?api-versi                                                                                                                     on=2014-05"
    request.body = body
    request.headers.append(('Content-Type', 'application/atom+xml;type=entry;cha                                                                                                                     rset=utf-8'))

    authentication.sign_request(request, httpclient)

    request.headers.append(('Content-Length', str(len(request.body))))

    status = 0

    try:
        resp = httpclient.perform_request(request)
        status = resp.status

    except HTTPError as ex:
        status = ex.status

    return status

class EventDataParser(object):

  def getMessage():
    host = socket.gethostname()


    first = True

    body = "{ \"DeviceId\" : 1, \"Temperature\" : 0.0}"

    return body

hubClient = EventHubClient()
parser = EventDataParser()
hostname = socket.gethostname()

#body
#="{\"DeviceId\":"+randint(0,100)+",\"Temperature\":"+uniform(0,50)+"}"

while True:
        irand = randrange(0,300)
        frand = randrange(0,80)  #uniform(0,50)
        body="{\"DeviceId\":"+str(irand)+",\"Temperature\":"+str(frand)+"}"
        hubStatus = hubClient.sendMessage(body,hostname)
# return the HTTP status to the caller
        print hubStatus
