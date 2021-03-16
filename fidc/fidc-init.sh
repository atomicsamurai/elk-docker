#!/bin/bash

if [ -z "$KIBANA_URL" ]; then
    KIBANA_URL=http://localhost:5601
fi
if [ -z "$ES_URL" ]; then
    ES_URL=http://localhost:9200
fi

echo -n "Creating index pattern...."
curl "${KIBANA_URL}/api/saved_objects/index-pattern/filebeat-*" \
    -s \
    -X POST \
    -H 'kbn-xsrf: true' \
    -H 'Content-Type: application/json' \
    -d '{"attributes": {"title": "filebeat-*"}}'
echo "done"

echo -n "Creating ForgeRock Summary Canvas...."
curl \
  -s \
  -X POST \
  "${KIBANA_URL}/api/saved_objects/_import" \
  -H "kbn-xsrf: true" \
  --form file=@/opt/fidc/Workpad_FRSummary.ndjson

echo "done"

echo -n "Creating ingest pipelines...."
curl \
  -s \
  -X PUT \
  "${ES_URL}/_ingest/pipeline/geoip-and-useragent" -H 'Content-Type: application/json' \
  -d'
{
  "description" : "Add geoip info",
  "processors" : [
    {
      "geoip" : {
        "field" : "json_payload.http.request.client_ip",
        "ignore_missing": true
      }
    },
    {
      "user_agent" : {
        "field" : "json_payload.http.request.headers.user-agent-extracted",
        "ignore_missing": true
      }
    }
  ]
}
'
echo "done"