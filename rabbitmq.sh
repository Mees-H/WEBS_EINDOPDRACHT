#!/bin/sh

docker run -d --name webs-rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management