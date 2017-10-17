'use strict';

const request = require('request-promise');
const cheerio = require('cheerio');
const R = require('ramda');

const segmentum = function (options) {
  if (!options.email) throw new Error('email is required.');
  if (!options.password) throw new Error('password is required.');

  let cookieJar = request.jar();

  function buildReq (options) {
    return Object.assign(
      options || {},
      {
        'headers': {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:51.0) Gecko/20100101 Firefox/51.0'
        },
        'json': true,
        'resolveWithFullResponse': false,
        jar: cookieJar
      }
    );
  }

  function getCSRF (url) {
    return request(
      buildReq({
        uri: url,
        method: 'GET'
      })
    )
    .then(extractCSRF);
  }

  function extractCSRF (content) {
    return cheerio.load(content)('script.data[data-namespace="csrf"]').html().replace(/&quot;/g, '');
  }

  function validate (data, fields) {
    (fields || []).map((item) => {
      if (typeof R.path(item.split('.'), data) === 'undefined') {
        throw new Error(`${item} is required.`);
      }
    });
  }

  function buildCall (method, uri, data, validateFields, urlCSRF, force, CSRFtoken) {
    validate(data, validateFields);

    const ro = buildReq({
      uri: uri,
      method: method,
      body: data || undefined
    });
    if (CSRFtoken) ro.headers['X-CSRF-Token'] = CSRFtoken;

    return (urlCSRF && !CSRFtoken)
      ? getCSRF(urlCSRF)
        .then((token) =>
          buildCall(method, uri, data, validateFields, urlCSRF, force, token)
        )
      : tryCall(ro, force);
  }

  function tryCall (ro, force) {
    const isSessionNotFound = (e) => e.statusCode === 401 && !force;
    return new Promise((resolve, reject) =>
      request(ro)
      .then(resolve)
      .catch((e) =>
        isSessionNotFound(e)
        ? buildCall('POST', 'https://segment.com/api/session', {email: options.email, password: options.password}, ['email', 'password'], 'https://segment.com/login', true)
          .then((ok) =>
            tryCall(ro, true)
            .then(resolve)
            .catch(reject)
          )
          .catch(reject)
        : reject(e))
    );
  }

  return {
    login: () =>
      buildCall(
        'POST',
        'https://segment.com/api/session',
        {email: options.email, password: options.password},
        ['email', 'password'],
        'https://segment.com/login'
      ),
    getWorkspaces: () =>
      buildCall(
        'GET',
        'https://segment.com/api/workspaces'
      ),
    createWorkspace: (data) =>
      buildCall(
        'POST',
        'https://segment.com/api/workspaces',
        data,
        ['name', 'slug', 'billing.email'],
        'https://segment.com/workspaces/new'
      ),
    deleteWorkspace: (name) =>
      buildCall(
        'DELETE',
        `https://segment.com/api/workspaces/${name}`,
        null,
        [],
        `https://segment.com/${name}/settings/basic`
      ),
    getSourceMetadata: (source) =>
      buildCall(
        'GET',
        'https://segment.com/api/metadata/source' + (source ? `/${source}` : '')
      ),
    createSource: (workspaceSlug, sourceType, data) =>
      buildCall(
        'POST',
        `https://segment.com/api/workspaces/${workspaceSlug}/projects`,
        data,
        ['sourceId', 'name', 'slug', 'enabled'],
        `https://segment.com/${workspaceSlug}/sources/setup/${sourceType}`
      ),
    updateSource: (workspaceSlug, sourceType, sourceSlug, data) =>
      buildCall(
        'PATCH',
        `https://segment.com/api/workspaces/${workspaceSlug}/projects/${sourceSlug}`,
        data,
        [],
        `https://segment.com/${workspaceSlug}/sources/setup/${sourceType}`
      ),
    getSources: (workspaceSlug) =>
      buildCall(
        'GET',
        `https://segment.com/api/workspaces/${workspaceSlug}/projects`
      ),
    getSource: (workspaceSlug, name) =>
      buildCall(
        'GET',
        `https://segment.com/api/workspaces/${workspaceSlug}/projects/${name}`
      ),
    deleteSource: (workspaceSlug, sourceSlug) =>
      buildCall(
        'DELETE',
        `https://segment.com/api/workspaces/${workspaceSlug}/projects/${sourceSlug}`,
        null,
        [],
        `https://segment.com/${workspaceSlug}/sources/${sourceSlug}/settings`
      ),
    getIntegrationMetadata: (integration) =>
      buildCall(
        'GET',
        'https://segment.com/api/metadata/integration' + (integration ? `/${integration}` : '')
      ),
    setIntegration: (workspaceSlug, sourceSlug, integrationName, integrationSlug, data) =>
      buildCall(
        'PUT',
        `https://segment.com/api/workspaces/${workspaceSlug}/projects/${sourceSlug}/integrations/${encodeURIComponent(integrationName)}`,
        data,
        [],
        `https://segment.com/${workspaceSlug}/sources/${sourceSlug}/integrations/${integrationSlug}`
      ),
    getIntegrationSettings: (workspaceSlug, sourceSlug) =>
      buildCall(
        'GET',
        `https://segment.com/api/workspaces/${workspaceSlug}/projects/${sourceSlug}/integration-settings`
      ),
    getBitToolMetadata: (bitTool) =>
      buildCall(
        'GET',
        'https://segment.com/api/metadata/bitool' + (bitTool ? `/${bitTool}` : '')
      ),
    getWarehouseMetadata: (warehouse) =>
      buildCall(
        'GET',
        'https://segment.com/api/metadata/warehouse' + (warehouse ? `/${warehouse}` : '')
      ),
    createWarehouse: (workspaceSlug, data) =>
      buildCall(
        'POST',
        `https://segment.com/api/workspaces/${workspaceSlug}/warehouses`,
        data,
        ['settings'],
        `https://segment.com/${workspaceSlug}/warehouses`
      ),
    getBillingCounts: (workspaceSlug) =>
      buildCall(
        'GET',
        `https://segment.com/api/workspaces/${workspaceSlug}/billing/counts?period=${new Date().toISOString()}`
      ),
    getBilling: (workspaceSlug) =>
      buildCall(
        'GET',
        `https://segment.com/api/workspaces/${workspaceSlug}/billing`
      )
  };
};

module.exports = segmentum;
