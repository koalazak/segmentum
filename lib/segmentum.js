'use strict';

const request = require('request-promise');
const cheerio = require('cheerio');
const R = require('ramda');

const segmentum = function (options) {
  if (!options.email) throw new Error('email is required.');
  if (!options.password) throw new Error('password is required.');

  let cookieJar = request.jar();

  const defaultRequestOptions = {
    'headers': {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:51.0) Gecko/20100101 Firefox/51.0'
    },
    'json': true,
    'resolveWithFullResponse': false,
    jar: cookieJar
  };

  function req () {
    return Object.assign({}, defaultRequestOptions);
  }

  function getCSRF (url) {
    let ro = req();
    ro.uri = url;
    ro.method = 'GET';
    return request(ro).then((data) => extractCSRF(data));
  }

  function extractCSRF (content) {
    const $ = cheerio.load(content);
    return $('script.data[data-namespace="csrf"]').html().replace(/&quot;/g, '');
  }

  function validate (data, fields) {
    (fields || []).map((item) => {
      if (typeof R.path(item.split('.'), data) === 'undefined') {
        throw new Error(`${item} is required.`);
      }
    });
  }

  function buildCall (method, uri, data, validateFields, urlCSRF, force) {
    validate(data, validateFields);
    let ro = req();
    ro.uri = uri;
    if (data) ro.body = data;
    ro.method = method;

    if (urlCSRF) {
      return getCSRF(urlCSRF).then((token) => {
        ro.headers['X-CSRF-Token'] = token;
        return tryCall(ro, force);
      });
    }

    return tryCall(ro, force);
  }

  function tryCall (ro, force) {
    return new Promise((resolve, reject) => {
      request(ro).then(resolve).catch((e) => {
        if (e.statusCode === 401 && !force) {
          console.log('Segment.io session not found. Trying re-login...');
          return buildCall('POST', 'https://segment.com/api/session', {email: options.email, password: options.password}, ['email', 'password'], null, true).then((ok) => {
            return tryCall(ro, true).then(resolve).catch(reject);
          }).catch(reject);
        }
        return reject(e);
      });
    });
  }

  return {
    login: () => buildCall('POST', 'https://segment.com/api/session', {email: options.email, password: options.password}, ['email', 'password'], 'https://segment.com/login'),
    getWorkspaces: () => buildCall('GET', 'https://segment.com/api/workspaces'),
    createWorkspace: (data) => buildCall('POST', 'https://segment.com/api/workspaces', data, ['name', 'slug', 'billing.email'], 'https://segment.com/workspaces/new'),
    deleteWorkspace: (name) => buildCall('DELETE', `https://segment.com/api/workspaces/${name}`, null, [], `https://segment.com/${name}/settings/basic`),
    getSourceMetadata: (source) => buildCall('GET', 'https://segment.com/api/metadata/source' + (source ? `/${source}` : '')),
    createSource: (workspaceSlug, sourceType, data) => buildCall('POST', `https://segment.com/api/workspaces/${workspaceSlug}/projects`, data, ['sourceId', 'name', 'slug', 'enabled'], `https://segment.com/${workspaceSlug}/sources/setup/${sourceType}`),
    updateSource: (workspaceSlug, sourceType, sourceSlug, data) => buildCall('PATCH', `https://segment.com/api/workspaces/${workspaceSlug}/projects/${sourceSlug}`, data, [], `https://segment.com/${workspaceSlug}/sources/setup/${sourceType}`),
    getSources: (workspaceSlug) => buildCall('GET', `https://segment.com/api/workspaces/${workspaceSlug}/projects`),
    getSource: (workspaceSlug, name) => buildCall('GET', `https://segment.com/api/workspaces/${workspaceSlug}/projects/${name}`),
    deleteSource: (workspaceSlug, sourceSlug) => buildCall('DELETE', `https://segment.com/api/workspaces/${workspaceSlug}/projects/${sourceSlug}`, null, [], `https://segment.com/${workspaceSlug}/sources/${sourceSlug}/settings`),
    getIntegrationMetadata: (integration) => buildCall('GET', 'https://segment.com/api/metadata/integration' + (integration ? `/${integration}` : '')),
    setIntegration: (workspaceSlug, sourceSlug, integrationName, integrationSlug, data) => buildCall('PUT', `https://segment.com/api/workspaces/${workspaceSlug}/projects/${sourceSlug}/integrations/${encodeURIComponent(integrationName)}`, data, [], `https://segment.com/${workspaceSlug}/sources/${sourceSlug}/integrations/${integrationSlug}`),
    getIntegrationSettings: (workspaceSlug, sourceSlug) => buildCall('GET', `https://segment.com/api/workspaces/${workspaceSlug}/projects/${sourceSlug}/integration-settings`),
    getBitToolMetadata: (bitTool) => buildCall('GET', 'https://segment.com/api/metadata/bitool' + (bitTool ? `/${bitTool}` : '')),
    getWarehouseMetadata: (warehouse) => buildCall('GET', 'https://segment.com/api/metadata/warehouse' + (warehouse ? `/${warehouse}` : '')),
    createWarehouse: (workspaceSlug, data) => buildCall('POST', `https://segment.com/api/workspaces/${workspaceSlug}/warehouses`, data, ['settings'], `https://segment.com/${workspaceSlug}/warehouses`),
    getBillingCounts: (workspaceSlug) => buildCall('GET', `https://segment.com/api/workspaces/${workspaceSlug}/billing/counts?period=${new Date().toISOString()}`),
    getBilling: (workspaceSlug) => buildCall('GET', `https://segment.com/api/workspaces/${workspaceSlug}/billing`)
  };
};

module.exports = segmentum;
