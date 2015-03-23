#!/bin/bash

# a shell script with curl commands to do basic testing of a web service/REST API

# set the hostname and port number
export HOST=localhost
export PORT=3000

# get all items
#curl -i http://$HOST:$PORT/items

# get a single item
#curl -i http://$HOST:$PORT/items/1

# authenticated get
#curl -i -u admin:admin http://$HOST:$PORT/items

# add an item
curl -i -H "Content-Type: application/json" -X POST -d '{"fortune": "Ships are safe in harbor, but they were never meant to stay there."}' http://$HOST:$PORT/fortunes
#curl -i -H "Content-Type: application/json" -X POST -d '{"name":"Washington University"}' http://$HOST:$PORT/items

# update that item
#curl -i -H "Content-Type: application/json" -X PUT -d '{"founded": "February 22, 1853"}' http://$HOST:$PORT/items/3

# delete an item
#curl -i -X DELETE http://$HOST:$PORT/items/2

# get that new item
#curl -i http://$HOST:$PORT/items/3
