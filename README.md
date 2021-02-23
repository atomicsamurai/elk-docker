### Changes:

22-Feb-2021 21:02:00MST - Moved from OSS versions to "Basic" licensed ones. Also filtered out IDM "ping" entries.

18-Dec-2020 11:02:00MST - Sync'ed the tail script with upstream (https://github.com/vscheuber/fidc-debug-tools), fixing the issue where the `pagedResultsCookie` was getting reset in case of an error response from the log API.


# An ELK docker stack for ForgeRock Identity Cloud (FIDC)
This docker image contains the complete ELK stack. This is a fork of https://github.com/spujadas/elk-docker. View the original [README](README-orig.md).

FIDC logs are accessible through a REST API (https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html), which is rate limited by Google. That makes it challenging for multiple people to pull or view the logs at the same time.

This docker image can be used to pull FIDC logs into a local ELK instance which can then be used by multiple people in a team using the Kibana web UI.

## To run
1. Make sure you have docker installed on the host where you want to run this.

2. Set the mmaps count on the host to recommeded value:
```
sudo sysctl -w vm.max_map_count=262144
```
More information [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html)

3. Create one or more environment file(s), as needed, with the following contents.

An example `.env.dev`
```
#!/bin/bash

export ORIGIN="https://<tenant url>"
export API_KEY_ID="67xxxxxxxxxxxxxxxxxxxxxxxxxxx221"
export API_KEY_SECRET="acxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxd6"
export LOG_SOURCE="am-everything"
```
`LOG_SOURCE` can be one of:
```
am-access
am-activity
am-authentication
am-config
am-core
am-everything
ctsstore
ctsstore-access
ctsstore-config-audit
ctsstore-upgrade
idm-access
idm-activity
idm-authentication
idm-config
idm-core
idm-everything
idm-sync
userstore
userstore-access
userstore-config-audit
userstore-ldif-importer
userstore-upgrade
```

4. Source the environment file
```
$ source .dev.env
```

5. Launch the container:
Using docker-compose
```
docker-compose up -d
```

Use this `docker-compose.yml`
```
version: '3.7'
services:
  minecraftserver:
    image: sandeepc0/elk
    container_name: elk-non-oss
    deploy:
      resources:
        limits:
          memory: 8G
    environment:
      ES_HEAP_SIZE: "4G"
      ORIGIN: "${ORIGIN}"
      API_KEY_ID: "${API_KEY_ID}"
      API_KEY_SECRET: "${API_KEY_SECRET}"
      LOG_SOURCE: "${LOG_SOURCE}"
      # LOGSTASH_START: "0"
    ports:
      - "5601:5601"
      - "9200:9200"
      - "5044:5044"
```

OR

With the command
```
docker run \
    -d \
    -p 5601:5601 \
    -p 9200:9200 \
    --env ORIGIN="$ORIGIN" \
    --env API_KEY_ID="$API_KEY_ID" \
    --env API_KEY_SECRET="$API_KEY_SECRET" \
    --env LOG_SOURCE="$LOG_SOURCE" \
    --env ES_HEAP_SIZE="4G" \
    --name elk sandeepc0/fidc
```

6. Wait for a a minute or two for the stack to start up. Optionally, you can tail the container logs to check when the services have started successfully. After that, we are ready to configure kibana.

7. Go to `http://<host>:5601/`, click on the sandwich menu icon in top-left and select "Stack Management" and then click "Index Patterns".

8. Click "Create index pattern" and type `fidc-*`

9. Click "Next"

10. Select `@timestamp` from the dropdown box, click "Create index pattern".

11. Click the sandwich menu icon again and select "Discover".

12. Now you can see events logged.

