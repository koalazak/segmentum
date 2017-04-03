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

  function buildCall (method, uri, data, validateFields, urlCSRF) {
    validate(data, validateFields);
    let ro = req();
    ro.uri = uri;
    if (data) ro.body = data;
    ro.method = method;

    if (urlCSRF) {
      return getCSRF(urlCSRF).then((token) => {
        ro.headers['X-CSRF-Token'] = token;
        return request(ro);
      });
    }

    return request(ro);
  }

  return {
    login: () => buildCall('POST', 'https://segment.com/api/session', {email: options.email, password: options.password}, ['email', 'password']),
    createWorkspace: (data) => buildCall('POST', 'https://segment.com/api/workspaces', data, ['name', 'slug', 'billing.email'], 'https://segment.com/workspaces/new'),
    deleteWorkspace: (name) => buildCall('DELETE', `https://segment.com/api/workspaces/${name}`, null, [], `https://segment.com/${name}/settings/basic`),
    getWorkspaces: () => buildCall('GET', 'https://segment.com/api/workspaces'),
    getSourceMetadata: (source) => buildCall('GET', 'https://segment.com/api/metadata/source' + (source ? `/${source}` : '')),
    getIntegrationMetadata: (integration) => buildCall('GET', 'https://segment.com/api/metadata/integration' + (integration ? `/${integration}` : '')),
    getBitToolMetadata: (bitTool) => buildCall('GET', 'https://segment.com/api/metadata/bitool' + (bitTool ? `/${bitTool}` : '')),
    getWarehouseMetadata: (warehouse) => buildCall('GET', 'https://segment.com/api/metadata/warehouse' + (warehouse ? `/${warehouse}` : '')),
    createSource: (workspaceSlug, sourceType, data) => buildCall('POST', `https://segment.com/api/workspaces/${workspaceSlug}/projects`, data, ['sourceId', 'name', 'slug', 'enabled'], `https://segment.com/${workspaceSlug}/sources/setup/${sourceType}`),
    getProjects: (workspaceSlug) => buildCall('GET', `https://segment.com/api/workspaces/${workspaceSlug}/projects`),
    getProject: (workspaceSlug, name) => buildCall('GET', `https://segment.com/api/workspaces/${workspaceSlug}/projects/${name}/overview`),
    getBillingCounts: (workspaceSlug) => buildCall('GET', `https://segment.com/api/workspaces/${workspaceSlug}/billing/counts?period=${new Date().toISOString()}`),
    getBilling: (workspaceSlug) => buildCall('GET', `https://segment.com/api/workspaces/${workspaceSlug}/billing`),
    createWarehouse: (workspaceSlug, data) => buildCall('POST', `https://segment.com/api/workspaces/${workspaceSlug}/warehouses`, data, ['settings'], `https://segment.com/${workspaceSlug}/warehouses`)
  };
};

module.exports = segmentum;
