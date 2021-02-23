
const origin = '##ORIGIN##';
const api_key_id = '##API_KEY_ID##';
const api_key_secret = '##API_KEY_SECRET##';
const source = '##LOG_SOURCE##';

/* Specify the logs' source, as described in https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html#getting_sources
Currently available sources are listed below.
Uncomment the source you want to use.
For development and debugging use "am-core" and "idm-core" respectively.
*/

// const source = 'am-access'
// const source = 'am-activity'
// const source = 'am-authentication'
// const source = 'am-config'
// const source = 'am-core'
// const source = 'am-everything'
// const source = 'ctsstore'
// const source = 'ctsstore-access'
// const source = 'ctsstore-config-audit'
// const source = 'ctsstore-upgrade'
// const source = 'idm-access'
// const source = 'idm-activity'
// const source = 'idm-authentication'
// const source = 'idm-config'
// const source = 'idm-core'
// const source = 'idm-everything'
// const source = 'idm-sync'
// const source = 'userstore'
// const source = 'userstore-access'
// const source = 'userstore-config-audit'
// const source = 'userstore-ldif-importer'
// const source = 'userstore-upgrade'

// import categories from('./categories.json');
const showLogs = undefined

const misc_noise = [
    'text/plain',
    'http://null:8080/openidm/info/ping',
    'https://null:8080/openidm/info/ping',
    'com.iplanet.dpro.session.operations.ServerSessionOperationStrategy',
    'com.iplanet.dpro.session.SessionIDFactory',
    'com.iplanet.dpro.session.share.SessionEncodeURL',
    'com.iplanet.services.naming.WebtopNaming',
    'com.iplanet.sso.providers.dpro.SSOProviderImpl',
    'com.sun.identity.authentication.AuthContext',
    'com.sun.identity.authentication.client.AuthClientUtils',
    'com.sun.identity.authentication.config.AMAuthConfigType',
    'com.sun.identity.authentication.config.AMAuthenticationManager',
    'com.sun.identity.authentication.config.AMAuthLevelManager',
    'com.sun.identity.authentication.config.AMConfiguration',
    'com.sun.identity.authentication.jaas.LoginContext',
    'com.sun.identity.authentication.modules.application.Application',
    'com.sun.identity.authentication.server.AuthContextLocal',
    'com.sun.identity.authentication.service.AMLoginContext',
    'com.sun.identity.authentication.service.AuthContextLookup',
    'com.sun.identity.authentication.service.AuthD',
    'com.sun.identity.authentication.service.AuthUtils',
    'com.sun.identity.authentication.service.DSAMECallbackHandler',
    'com.sun.identity.authentication.service.LoginState',
    'com.sun.identity.authentication.spi.AMLoginModule',
    'com.sun.identity.delegation.DelegationEvaluatorImpl',
    'com.sun.identity.idm.plugins.internal.AgentsRepo',
    'com.sun.identity.idm.server.IdCachedServicesImpl',
    'com.sun.identity.idm.server.IdRepoPluginsCache',
    'com.sun.identity.idm.server.IdServicesImpl',
    'com.sun.identity.log.spi.ISDebug',
    'com.sun.identity.shared.encode.CookieUtils',
    'com.sun.identity.sm.ldap.SMSLdapObject',
    'com.sun.identity.sm.CachedSMSEntry',
    'com.sun.identity.sm.CachedSubEntries',
    'com.sun.identity.sm.DNMapper',
    'com.sun.identity.sm.ServiceConfigImpl',
    'com.sun.identity.sm.ServiceConfigManagerImpl',
    'com.sun.identity.sm.SMSEntry',
    'com.sun.identity.sm.SMSUtils',
    'com.sun.identity.sm.SmsWrapperObject',
    'org.apache.http.client.protocol.RequestAuthCache',
    'org.apache.http.impl.conn.PoolingHttpClientConnectionManager',
    'org.apache.http.impl.nio.client.InternalHttpAsyncClient',
    'org.apache.http.impl.nio.client.InternalIODispatch',
    'org.apache.http.impl.nio.client.MainClientExec',
    'org.apache.http.impl.nio.conn.ManagedNHttpClientConnectionImpl',
    'org.apache.http.impl.nio.conn.PoolingNHttpClientConnectionManager',
    'org.forgerock.audit.AuditServiceImpl',
    'org.forgerock.bloomfilter.ConcurrentRollingBloomFilter',
    'org.forgerock.bloomfilter.ExpiringBloomFilter',
    'org.forgerock.oauth2.core.RealmOAuth2ProviderSettings',
    'org.forgerock.openam.authentication.service.JAASModuleDetector',
    'org.forgerock.openam.authentication.service.LoginContextFactory',
    'org.forgerock.openam.blacklist.BloomFilterBlacklist',
    'org.forgerock.openam.blacklist.CTSBlacklist',
    'org.forgerock.openam.core.realms.impl.CachingRealmLookup',
    'org.forgerock.openam.core.rest.authn.RestAuthCallbackHandlerManager',
    'org.forgerock.openam.core.rest.authn.trees.AuthTrees',
    'org.forgerock.openam.cors.CorsFilter',
    'org.forgerock.openam.cts.CTSPersistentStoreImpl',
    'org.forgerock.openam.cts.impl.CoreTokenAdapter',
    'org.forgerock.openam.cts.impl.queue.AsyncResultHandler',
    'org.forgerock.openam.cts.reaper.ReaperDeleteOnQueryResultHandler',
    'org.forgerock.openam.headers.DisableSameSiteCookiesFilter',
    'org.forgerock.openam.idrepo.ldap.DJLDAPv3Repo',
    'org.forgerock.openam.rest.CsrfFilter',
    'org.forgerock.openam.rest.restAuthenticationFilter',
    'org.forgerock.openam.rest.fluent.CrestLoggingFilter',
    'org.forgerock.openam.session.cts.CtsOperations',
    'org.forgerock.openam.session.stateless.StatelessSessionManager',
    'org.forgerock.openam.sm.datalayer.impl.ldap.ExternalLdapConfig',
    'org.forgerock.openam.sm.datalayer.impl.ldap.LdapQueryBuilder',
    'org.forgerock.openam.sm.datalayer.impl.SeriesTaskExecutor',
    'org.forgerock.openam.sm.datalayer.impl.SeriesTaskExecutorThread',
    'org.forgerock.openam.sm.datalayer.providers.LdapConnectionFactoryProvider',
    'org.forgerock.openam.sm.file.ConfigFileSystemHandler',
    'org.forgerock.openam.social.idp.SocialIdentityProviders',
    'org.forgerock.openam.utils.ClientUtils',
    'org.forgerock.opendj.ldap.CachedConnectionPool',
    'org.forgerock.opendj.ldap.LoadBalancer',
    'org.forgerock.secrets.keystore.KeyStoreSecretStore',
    'org.forgerock.secrets.propertyresolver.PropertyResolverSecretStore',
    'org.forgerock.secrets.SecretsProvider',
    'org.forgerock.openam.core.rest.server.ServerInfoResource',
    'org.forgerock.openam.oauth2.token.grantset.AbstractGrantSetTokenStore',
    'org.forgerock.openam.secrets.SecretsProviderFacade',
    'com.iplanet.services.ldap.event.LDAPv3PersistentSearch',
    'com.sun.identity.policy.PolicyContinuousListener',
    'org.forgerock.openam.cts.reaper.TokenDeleter',
    'com.iplanet.dpro.session.service.AgentSessionNotificationPublisher',
    'com.iplanet.dpro.session.service.SessionNotificationSender',
    'org.forgerock.openam.oauth2.secrets.MappedPurposeDelegatingSecretStore',
    'com.sun.identity.idm.AMIdentity',
    'com.sun.identity.idm.IdUtils',
    'org.forgerock.openam.rest.SSOTokenFactory',
    'org.forgerock.openam.core.rest.IdentityResourceV2',
    'com.iplanet.dpro.session.service.SessionServiceConfig$HotSwappableSessionServiceConfig',
    'com.sun.identity.common.ISAccountLockout'
];

// console.log({origin: origin, key: api_key_id});
function tail({
    origin,
    api_key_id,
    api_key_secret,
    source,
    frequency,
    exclude,
    filter,
    showLogs,
}) {

    frequency = frequency * 1000 || 10000

    /**
     * Processes the logs' content: filters, formats, etc.
     * If no `showLogs` method is passed in arguments, is applied to the data received from the REST endpoint.
     * In this instance, prepares stringified JSON output for a command line tool like `jq`.
     * @param {object} logsObject The object containing logs.
     * @param {object[]} [logsObject.result] An array of logs.
     * @param {string|object} [logsObject.result.payload] A log payload.
     */
    showLogs = showLogs || function ({
        logsObject
    }) {
        if (Array.isArray(logsObject.result)) {
            //console.error(`${logsObject.result.length}`);
            let excluded = 0;
            logsObject.result.forEach(log => {
                if ((exclude && (filter.includes(log.payload.logger) || filter.includes(log.type) || filter.includes(log.payload.http?.request.path))) ||
                    (!exclude && (!filter.includes(log.payload.logger) || !filter.includes(log.type)))) {
                    excluded++
                    // console.error('EXCLUDED: exclude='+exclude+' filter includes '+log.payload.logger+'='+filter.includes(log.payload.logger)+' filter includes '+log.type+'='+filter.includes(log.type))
                } else {
                    // console.error('INCLUDED: exclude='+exclude+' filter includes '+log.payload.logger+'='+filter.includes(log.payload.logger)+' filter includes '+log.type+'='+filter.includes(log.type))
                    console.log(JSON.stringify(log.payload))
                }
            })
            // if (excluded > 0) {
            //     console.error('Filtered out ' + excluded + ' events.')
            // }
        } else {
            console.error(JSON.stringify(logsObject))
        }
    }

    /**
     * @returns {string} Concatenated query string parameters.
     */
    function getParams() {
        return Object.keys(params).map((key) => {
            if (params[key]) {
                return (key + "=" + encodeURIComponent(params[key]))
            }
        }).join("&")
    }

    /**
     * Obtains logs from the '/monitoring/logs/tail' endpoint.
     * Keeps track of the last request's `pagedResultsCookie` to avoid overlaps in the delivered content.
     */
    function getLogs() {
        // Authorization options.
        let rateLimit = 0;
        let rateLimitRemaining = 0;
        let rateLimitReset = 0;
        const options = {
            headers: {
                'x-api-key': api_key_id,
                'x-api-secret': api_key_secret
            }
        }
        // The API call.
        http.get(
            origin + '/monitoring/logs/tail?' + getParams(),
            options,
            (res) => {
                // console.log(res.headers);
                rateLimit = parseInt(res.headers['x-ratelimit-limit']);
                rateLimitRemaining = parseInt(res.headers['x-ratelimit-remaining']);
                rateLimitReset = parseInt(res.headers['x-ratelimit-reset']) * 1000  | frequency;
                var data = ''

                // To avoid dependencies, use the native module and receive data in chunks.
                res.on('data', (chunk) => {
                    data += chunk
                })

                // Process the data when the entire response has been received.
                res.on('end', () => {
                    var logsObject

                    try {
                        logsObject = JSON.parse(data)
                    } catch (e) {
                        logsObject = {
                            "scriptError": String(e)
                        }
                    }
                    showLogs({
                        logsObject
                    })

                    // Set the _pagedResultsCookie query parameter for the next request
                    // to retrieve all records stored since the last one.
                    if (logsObject.pagedResultsCookie) {
                        params._pagedResultsCookie = logsObject.pagedResultsCookie;
                    }
                })
                setTimeout(getLogs, getTimeout(rateLimitReset));
            }
        )
    }

    function getTimeout(rateLimitReset) {
        const rightNow = Date.now();
        let timeout = 0;
        timeout = rateLimitReset - rightNow;
        timeout = timeout < 0 ? 0 : timeout;
        timeout = timeout < frequency ? frequency : timeout;
        // console.error(`"next in ${timeout}ms"`);
        return timeout;
    }
    /**
     * Derives a native module name from the origin; 'http' or 'https' is expected.
     */
    const moduleName = (new URL(origin)).protocol.split(':')[0]
    const http = require(moduleName)

    /**
     * Defines URL query string params.
     */
    var params = {
        source: source
    }

    getLogs()
}

tail({
    origin: origin,
    api_key_id: api_key_id,
    api_key_secret: api_key_secret,
    source: source,
    frequency: 5,
    exclude: true,
    filter: misc_noise,
    showLogs: showLogs
})