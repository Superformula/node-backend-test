#!/usr/bin/env bash

# expects the container to
# be running on 8080

echo deleting test record
curl -XDELETE \
     -H "Authorization:abc" \
     -H "Content-Type:application/json" \
     localhost:8080/v1/users/615e50ad-03fe-4d93-8802-e2fd83e07295

echo

echo creating test record
curl -XPOST \
     -H "Authorization:abc" \
     -H "Content-Type:application/json" \
     localhost:8080/v1/users \
     -d '{
        "id":"615e50ad-03fe-4d93-8802-e2fd83e07295",
        "name":"testing",
        "dob":"2019-01-01T00:00:00.000Z",
        "address":"1 test place",
        "description":"this is a test",
        "createdAt":"2019-01-01T00:00:00.000Z"
        }'

echo
echo

echo fetching all records
curl -XGET \
     -H "Authorization:abc" \
     -H "Content-Type:application/json" \
     localhost:8080/v1/users \

echo
echo

echo updating record
curl -XPUT \
     -H "Authorization:abc" \
     -H "Content-Type:application/json" \
     localhost:8080/v1/users/615e50ad-03fe-4d93-8802-e2fd83e07295 \
     -d '{
        "id":"615e50ad-03fe-4d93-8802-e2fd83e07295",
        "name":"something different",
        "dob":"2019-01-01T00:00:00.000Z",
        "address":"1 test place",
        "description":"this is a test",
        "createdAt":"2019-01-01T00:00:00.000Z"
        }'

echo
echo

echo fetching single records
curl -XGET \
     -H "Authorization:abc" \
     -H "Content-Type:application/json" \
     localhost:8080/v1/users/615e50ad-03fe-4d93-8802-e2fd83e07295

echo
echo

echo deleting test record again
curl -XDELETE \
     -H "Authorization:abc" \
     -H "Content-Type:application/json" \
     localhost:8080/v1/users/615e50ad-03fe-4d93-8802-e2fd83e07295

echo

echo fetching all records
curl -XGET \
     -H "Authorization:abc" \
     -H "Content-Type:application/json" \
     localhost:8080/v1/users \

echo
echo


