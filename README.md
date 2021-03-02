### Changes:

02-Mar-2021 - Using filebeat to pull logs from ForgeRock ID Cloud
22-Feb-2021 - Moved from OSS versions to "Basic" licensed ones. Also filtered out IDM "ping" entries.
18-Dec-2020 - Sync'ed the tail script with upstream (https://github.com/vscheuber/fidc-debug-tools), fixing the issue where the `pagedResultsCookie` was getting reset in case of an error response from the log API.


# An ELK docker stack for ForgeRock Identity Cloud (FIDC)
This docker image contains the complete ELK stack. This is a fork of https://github.com/spujadas/elk-docker.

## To Use

1. First, export environment variables to point to a ID Cloud tenant. Best practice is to create separate `env` files specific to each environment. An example `.env.customername` file coule be:

```
export ORIGIN="https://<tenant url>"
export API_KEY_ID="67xxxxxxxxxxxxxxxxxxxxxxxxxxx221"
export API_KEY_SECRET="acxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxd6"
export LOG_SOURCE="am-authentication,am-access"
```

LOG_SOURCE can be a comma separated list of any of the following:
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
Beware that for every item in the comma separated list, filebeat will make a separate request (using a separate httpjson input). With a large list, one can easily overwhelm the GCP API quotas.

2. Source the environment file

```
$ source .dev.env
```

3. To run the ELK container, use the following code to create a docker-compose.yml on your machine.
```
version: '3.7'
services:
  elk:
    image: sandeepc0/elk-fidc
    container_name: elk-forgerock-idcloud
    deploy:
      resources:
        limits:
          memory: 8G
    environment:
      ES_HEAP_SIZE: "4G"
    ports:
      - "5601:5601"
      - "9200:9200"
      - "5044:5044"
  filebeat:
    image: sandeepc0/filebeat-fidc
    container_name: filebeat-forgerock-idcloud
    environment:
      ORIGIN: "${ORIGIN}"
      API_KEY_ID: "${API_KEY_ID}"
      API_KEY_SECRET: "${API_KEY_SECRET}"
      LOG_SOURCE: "${LOG_SOURCE}"
```

4. Then, to start the containers, from the directory where the above docker-compose.yml is, run
```
$ docker-compose up -d
```
This will start the ELK and filebeat container.

5. Wait for a a minute or two for the stack to start up. Optionally, you can tail the container logs to check when the services have started successfully.

6. After that, we are ready to configure kibana.

7. Go to http://<host>:5601/, click on the sandwich menu icon in top-left and select "Stack Management" and then click "Index Patterns".

8. Click "Create index pattern" and type fidc-*

9. Click "Next"Select @timestamp from the dropdown box, click "Create index pattern".

10. Click the sandwich menu icon again and select "Discover".

Now you should see events in the interface.

## TODO
1. Auto-add index pattern to Kibana.

2. Add steps for importing some ready-made ID Cloud related dashboards/visualizations in Kibana

3. Auto add queries/dashboards/visualizations to Kibana.
