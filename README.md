### Changelog:

- 29-Apr-2021 - Added FIDC_LOG_END_TIME to only pull logs for a finite time window (does not work yes - details here: https://bugster.forgerock.org/jira/browse/FRAAS-6994)
- 13-Apr-2021
    - ** Important - changed environment variable names to make them specific to FIDC **
    - Added capability to pull logs from the past (not tailing)
    - Added configurable API request timeout (default 1m)
    - Added configurable interval between calls (does not apply to tail mode)
- 16-Mar-2021 - Added ingest pipeline to extract GeoIP and User Agent data from (applicable) log entries
- 15-Mar-2021 - Disabled logstash and automatic creation of index pattern and Canvas in Kibana
- 02-Mar-2021 - Using filebeat to pull logs from ForgeRock ID Cloud
- 22-Feb-2021 - Moved from OSS versions to "Basic" licensed ones. Also filtered out IDM "ping" entries.
- 18-Dec-2020 - Sync'ed the tail script with upstream (https://github.com/vscheuber/fidc-debug-tools), fixing the issue where the `pagedResultsCookie` was getting reset in case of an error response from the log API.


# An ELK docker stack for ForgeRock Identity Cloud (FIDC)
Overview
When using ForgeRock ID Cloud (ID Cloud), all the logs (application, debug and audit) are stored in GCP. An API is available for customers to get the log data over REST. It is documented here https://backstage.forgerock.com/docs/idcloud/latest/tenant-audit-logs.html.

The log events are sent in the REST response. While calling the REST API directly is great for a quick round of troubleshooting, if one wants to do some cross ref queries based on transactionId etc., importing the log events in a tool like Elasticsearch will be of great help.

There already are tools available which make life a bit easier when dealing with ID Cloud logs - like this one - https://github.com/vscheuber/fidc-debug-tools (tail.js) 

The advantage of sending logs to ELK is that they will be available in a central location for everyone to view locally. Also, the advanced query and visualization features can greatly help with monitoring and troubleshooting.

When using ELK to ingest and analyze ID Cloud logs, there are two main components involved.

The ELK stack which stores, indexes and lets one query and visualize log data
Something that can make REST API calls to ID Cloud and can be configured to connect to different ID Cloud tenants or different ELK stack. filebeat is used for this.
Here is what the architecture looks like:

![fidc_elk_arch.png](https://github.com/atomicsamurai/elk-docker/raw/master/images/fidc_elk_arch.png)


## To Use

### Prerequisites
1. Install docker and docker-compose on your machine.
2. Follow the steps from https://elk-docker.readthedocs.io/#prerequisites

### Running
1. First, export environment variables to point to a ID Cloud tenant. Best practice is to create separate env files specific to each environment. An example `.env.customername` file could be:
```
export FIDC_ORIGIN="https://<tenant url>"
export FIDC_API_KEY_ID="67xxxxxxxxxxxxxxxxxxxxxxxxxxx221"
export FIDC_API_KEY_SECRET="acxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxd6"
export FIDC_LOG_SOURCE="idm-sync,am-access,am-authentication,idm-core,am-core"
export FIDC_LOG_START_TIME="2021-03-10T00:00:00Z" # optional: only needed when pulling historical logs (not tailing)
export FIDC_LOG_END_TIME="2021-03-10T12:00:00Z"   # optional: only needed when pulling historical logs (not tailing)
export FIDC_PULL_INTERVAL="10s"                   # optional: default 10s (this is only used when FIDC_LOG_START_TIME is used)
export FIDC_LOG_REQUEST_TIMEOUT="1m"              # optional: default 1m
```

Or, download [env-sample](https://raw.githubusercontent.com/atomicsamurai/filebeat-docker/main/env-sample)

---
** NOTE **

If `FIDC_LOG_START_TIME` is set, filebeat will not "tail" the logs, instead it will start pulling logs from the specified instance in past. You should also  specify `FIDC_LOG_END_TIME`. If only `FIDC_LOG_START_TIME` is specified, you will get quota errors from ID Cloud. See quota rejection screenshot below.
![fidc_elk_quota.png](https://github.com/atomicsamurai/elk-docker/raw/master/images/fidc_elk_quota.png)

If you need to tail as well as pull historical logs, you can start a separate filebeat container without the `FIDC_LOG_START_TIME` variable set. How to do that is not covered in this doc.

---

`LOG_SOURCE` can be a comma separated list of any of the following:
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
$ source .env.tenantname
```

3. To run the ELK container, use the following code to create a docker-compose.yml on your machine.
```
version: '3.7'
services:
  elk:
    image: sandeepc0/elk-fidc
    container_name: elk-forgerock-idcloud
    environment:
      - ES_HEAP_SIZE="4G"
      - LOGSTASH_START="0"
    ports:
      - "5601:5601"
      - "9200:9200"
      - "5044:5044"
  filebeat:
    image: sandeepc0/filebeat-fidc
    container_name: filebeat-forgerock-idcloud
    environment:
      - TOGGLE_FOR_RESTART="no"
      - FIDC_ORIGIN
      - FIDC_API_KEY_ID
      - FIDC_API_KEY_SECRET
      - FIDC_LOG_SOURCE
      - FIDC_LOG_START_TIME         # optional: only needed when pulling historical logs (not tailing)
      - FIDC_LOG_END_TIME           # optional: only needed when pulling historical logs (not tailing)
      - FIDC_PULL_INTERVAL          # optional: default 10s (this is only used when FIDC_LOG_START_TIME is used)
      - FIDC_LOG_REQUEST_TIMEOUT    # optional: default 1m
```

Or, download [docker-compose.yml](https://raw.githubusercontent.com/atomicsamurai/filebeat-docker/main/docker-compose.yml)

4. Then, to start the containers, from the directory where the above downloaded `docker-compose.yml` is, run the following to start the stack.
```
$ docker-compose up -d
```
You can also run `docker-compose -p <project name> up -d` to manage as a docker-compose project

5. Wait for a a minute or two for the stack to start up. Optionally, you can tail the container logs to check when the services have started successfully.

6. After that, go to http://localhost:5601/

7. Click the sandwich menu icon and select "Discover".

8. You can now browse / query records.

9. There is also a starter [Canvas](https://www.elastic.co/webinars/intro-to-canvas-a-new-way-to-tell-visual-stories-in-kibana) which shows some popular / common statistics.

This can be accessed at http://localhost:5601/app/canvas#/workpad/workpad-forgerock-summary

A time period for restricting the data in Canvas can be selected at the top of page.

![canvas](https://github.com/atomicsamurai/elk-docker/raw/master/images/canvas1.png)

The reason for using a Canvas vs a Dashboard is because the data (`transactionId`) in the Canvas is clickable.

![clickable canvas](https://github.com/atomicsamurai/elk-docker/raw/master/images/canvas2.png)

Clicking on a `transactionId` in one of the tables in the Canvas will take you to the Discover app filtered for that `transactionId`.

![specific transactionId](https://github.com/atomicsamurai/elk-docker/raw/master/images/discover.png)

## Log event fields
In the logs events, JSON formatted logs are available in two fields:

- `json_payload` : contains events which are logged in JSON format by ForgeRock
- `text_payload` : contains events which are logged as plain text.

This information can be used to further query data and create saved queries and visualizations etc in Kibana.

## More Information

### The ELK stack
This is implemented as a docker container consisting of Elasticsearch, Logstash and Kibana. The image is available at: https://hub.docker.com/repository/docker/sandeepc0/elk-fidc (this is based on https://hub.docker.com/r/sebp/elk/).

---
** Warning **

The ELK stack (specially Elasticsearch) can require substantial system resources, specially if large number of records (which log data tends to have) are involved. Please follow the prerequisite steps to prepare your environment.

---

### Filebeat

"Filebeat is a lightweight shipper for forwarding and centralizing log data"

Filebeat has an `httpjson` input which is used here instead of tail.js. The `httpjson` input supports authentication, paged results (with page cookie) and also honors rate limit headers from ID Cloud API.

### Docker images on docker hub

- ELK image: https://hub.docker.com/repository/docker/sandeepc0/elk-fidc (https://github.com/atomicsamurai/elk-docker)
- Filebeat image: https://hub.docker.com/repository/docker/sandeepc0/filebeat-fidc (https://github.com/atomicsamurai/filebeat-docker)

## TODO
