#!/bin/bash

if [ -z "$KIBANA_URL" ]; then
    KIBANA_URL=http://localhost:5601
fi

echo -n "Creating index pattern...."

curl "${KIBANA_URL}/api/saved_objects/index-pattern/filebeat-*" \
    -v \
    -X POST \
    -H 'kbn-xsrf: true' \
    -H 'Content-Type: application/json' \
    -d '{"attributes": {"title": "filebeat-*"}}'

echo "done"

echo -n "Creating ForgeRock Summary Canvas...."

curl \
  -v \
  -X POST \
  "${KIBANA_URL}/api/saved_objects/_import" \
  -H "kbn-xsrf: true" \
  --form file=@/opt/fidc/Workpad_FRSummary.ndjson

echo "done"
