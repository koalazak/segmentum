# segmentum
[![Build Status](https://travis-ci.org/koalazak/segmentum.svg?branch=master)](https://travis-ci.org/koalazak/segmentum)
[![dependencies Status](https://david-dm.org/koalazak/segmentum/status.svg)](https://david-dm.org/koalazak/segmentum)
[![npm version](https://badge.fury.io/js/segmentum.svg?r)](http://badge.fury.io/js/segmentum)

Unofficial Segment.io Management node.js SDK (the scrapy way)

# Install


First you need node.js installed and then in your project directory:

```bash
$ npm install segmentum --save
```

# Quick start

Create `myapp.js` file with this content:

```javascript
const Segmentum = require ('segmentum');

const manage = new Segmentum({
  email: 'myemail@example.com',
  password: 'mypassword'
});

manage.login().then((data) => {
  console.log(data);
});

```

Then run your script:

```
$ node myapp.js
{ id: 'xxxxxxx',
  created: '2017-02-20T23:24:34.939Z',
  activated: null,
  isAdmin: false,
  name: 'Jose Perez',
  lastSeen: '2017-02-20T23:24:34.939Z',
  email: 'myemail@example.com',
  tags: {},
  salesforce: null,
  features: null }
```

## API

 * <a href="#Segmentum"><code><b>Segmentum(options)</b></code></a>

 * <a href="#login"><code>manage.<b>login()</b></code></a>

 * <a href="#getWorkspaces"><code>manage.<b>getWorkspaces()</b></code></a>

 * <a href="#createWorkspace"><code>manage.<b>createWorkspace(data)</b></code></a>

 * <a href="#deleteWorkspace"><code>manage.<b>deleteWorkspace(name)</b></code></a>

 * <a href="#getSourceMetadata"><code>manage.<b>getSourceMetadata([sourceSlug])</b></code></a>

 * <a href="#createSource"><code>manage.<b>createSource(workspaceSlug, sourceType, data)</b></code></a>

 * <a href="#updateSource"><code>manage.<b>updateSource(workspaceSlug, sourceType, sourceSlug, data)</b></code></a>

 * <a href="#getSources"><code>manage.<b>getSources(workspaceSlug)</b></code></a>

 * <a href="#getSource"><code>manage.<b>getSource(workspaceSlug, name)</b></code></a>

 * <a href="#deleteSource"><code>manage.<b>deleteSource(workspaceSlug, sourceType)</b></code></a>

 * <a href="#getIntegrationMetadata"><code>manage.<b>getIntegrationMetadata(integrationSlug)</b></code></a>

 * <a href="#setIntegration"><code>manage.<b>setIntegration(workspaceSlug, sourceSlug, integrationName, integrationSlug, data)</b></code></a>

  * <a href="#getIntegrationSettings"><code>manage.<b>getIntegrationSettings(workspaceSlug, sourceSlug)</b></code></a>

 * <a href="#getBitToolMetadata"><code>manage.<b>getBitToolMetadata([bitToolSlug])</b></code></a>

 * <a href="#getWarehouseMetadata"><code>manage.<b>getWarehouseMetadata([wherehouseSlug])</b></code></a>

 * <a href="#createWarehouse"><code>manage.<b>createWarehouse(workspaceSlug, warehouseId, data)</b></code></a>

 * <a href="#getBillingCounts"><code>manage.<b>getBillingCounts(workspaceSlug)</b></code></a>

 * <a href="#getBilling"><code>manage.<b>getBilling(workspaceSlug)</b></code></a>


<a name="Segmentum"></a>
### Segmentum(options)

* `options` is the client connection options.
  * `email`: is the email used in the web to login. *required*.
  * `password`: is the password used in the web to login. *required*.


Return a `manage` object

<a name="login"></a>
### manage.login()

Return a promise that resolve to:
```json
{
  "id": "xxxxxxx",
  "created": "2017-02-20T23:24:34.939Z",
  "activated": null,
  "isAdmin": false,
  "name": "Jose Perez",
  "lastSeen": "2017-02-20T23:24:34.939Z",
  "email": "myemail@example.com",
  "tags": {},
  "salesforce": null,
  "features": null
}
```

You need to call this before other methods to make sure you are logged in. Re-login is automaticaly handled if you call a method and your session is expired.

<a name="getWorkspaces"></a>
### manage.getWorkspaces()

Return a promise that resolve to an Array of workspaces:
```json
[
  {
    "id": "xxxxxxxxx",
    "version": 2,
    "created": "2017-02-20T23:24:35.365Z",
    "slug": "test344",
    "name": "Workspace Name1",
    "salesforce": null,
    "owners": [
      "xxxxxxxx"
    ],
    "features": null,
    "readKeys": [
      "read-123123-123123-1232-1232-123123123"
    ],
    "environment": null,
    "ids": null
  },
  {
    "id": "yyyyyyy",
    "version": 2,
    "created": "2017-02-21T12:59:20.221Z",
    "slug": "test345",
    "name": "test345",
    "salesforce": null,
    "owners": [
      "xxxxxxxx"
    ],
    "features": null,
    "readKeys": [
      "read-123123-123123-1232-1232-123123123"
    ],
    "environment": null,
    "ids": null
  }
]
```

<a name="createWorkspace"></a>
### manage.createWorkspace(data)

* `data` is the require object data to create a workspace.
  * `name`: Workspace name *required*
  * `slug`: Slug url *required*
  * `billing`: Object *required*
    * `email`: Manager Email address *required*

Return a promise that resolve to:
```json
{
  "id": "xxxxxxxxx",
  "version": 2,
  "created": "2017-02-21T12:59:49.619Z",
  "slug": "test344",
  "name": "test344",
  "salesforce": null,
  "owners": [
    "yyyyyyyy"
  ],
  "features": null,
  "readKeys": [
    "read-123123-123123-1232-1232-123123123"
  ],
  "environment": null,
  "ids": null
}
```

<a name="deleteWorkspace"></a>
### manage.deleteWorkspace(data)

* `name`: Workspace name *required*

Return a promise that resolve to:
```
HTTP 203 - Non-authoritative Information
```

<a name="getSourceMetadata"></a>
### manage.getSourceMetadata([sourceSlug])

Return a promise that resolve to an Array of available Sources or a specific source object if `sourceSlug` is provided.

```json
[
  {
    "id": "VOXa199Bdm",
    "name": "Marketo",
    "slug": "marketo",
    "createdAt": "2016-07-15T20:54:11.552Z",
    "type": "third-party",
    "website": "",
    "frequency": 10800,
    "description": "",
    "categories": [
      "cloud apps"
    ],
    "subtitle": null,
    "auth": {
      "requiredOptions": "Object"
    },
    "schema": null,
    "options": {
      "activity-type-ids": "Object",
      "client-id": "Object",
      "client-secret": "Object",
      "custom-lead-fields": "Object",
      "daily-limit": "Object",
      "munchkin_id": "Object"
    },
    "logos": {
      "alt": "https://cdn.filepicker.io/api/file/sCEWxuXKTAGZpPmps8sn",
      "default": "https://cdn.filepicker.io/api/file/sCEWxuXKTAGZpPmps8sn"
    },
    "webhook": null,
    "visibility": "beta",
    "tags": null,
    "environment": null,
    "docs": "",
    "github": "",
    "publicInfo": {
      "featuredData": "Object",
      "requiredInfo": null,
      "destinations": "Object",
      "code": "Not required",
      "useCases": "Object",
      "tagline": "",
      "links": null
    },
    "category": "cloud apps",
    "owners": null,
    "features": null,
    "allowed_workspace_ids": null,
    "oauth": false
  }
]
```

<a name="createSource"></a>
### manage.createSource(workspaceSlug, sourceType, data)

* `workspaceSlug` is the Workspace slug when you want to create a new source
* `sourceType` is the source type
* `data` Object
  * `sourceId`: The source ID you get with `getSourceMetadata()`. *required*.
  * `name`: a Name for the new source *required*.
  * `slug`: a slug url for the new source *required*.
  * `enabled`: Boolean *required*.

Return a promise that resolve to:

```json
{
  "id": "tttttttt",
  "created": "2017-02-21T13:26:28.951007525Z",
  "createdBy": "",
  "url": null,
  "slug": "newslug",
  "workspaceId": "gggggggg",
  "lastSeen": "0001-01-01T00:00:00Z",
  "collaborators": null,
  "readKeys": [
    "123123123123123123123123123"
  ],
  "writeKeys": [
    "34534534534534534534535345345"
  ],
  "plan": null,
  "timezone": "America/Los_Angeles",
  "name": "newname",
  "sourceId": "U9mT0bPcI6",
  "enabled": true,
  "settings": {},
  "advancedSync": null
}
```

<a name="updateSource"></a>
### manage.updateSource(workspaceSlug, sourceType, sourceSlug, data)

Uses a `PATCH` request under the hood. This means the data can only contain
the desired changes.

* `workspaceSlug` is the Workspace slug where you want to edit the source
* `sourceType` is the source type
* `sourceSlug`: slug of the source to update
* `data` Object
  * `name`: a new name for the source.
  * `enabled`: Boolean.

```json
{
  "id": "tttttttt",
  "created": "2017-02-21T13:26:28.951007525Z",
  "createdBy": "",
  "url": null,
  "slug": "newslug",
  "workspaceId": "gggggggg",
  "lastSeen": "0001-01-01T00:00:00Z",
  "collaborators": [],
  "readKeys": [
    "123123123123123123123123123"
  ],
  "writeKeys": [
    "34534534534534534534535345345"
  ],
  "timezone": "America/Los_Angeles",
  "name": "changedName",
  "sourceId": "sourceID",
  "enabled": true,
  "settings": null,
  "advancedSync": null,
  "workspace": {
    "id": "tttttttt",
    "created": "2017-02-21T13:26:28.951007525Z",
    "slug": "workspace-slug",
    "name": "WorkspaceSlug",
    "salesforce": null,
    "owners": [
        "xxxxxxxx"
    ],
    "features": null,
    "readKeys": [
        "123123123123123123123123123"
    ],
    "environment": null,
    "ids": null
  },
  "hasSentData": true,
  "integrations": []
}

```

<a name="getSources"></a>
### manage.getSources(workspaceSlug)

Return a promise that resolve to an array of your sources for the `workspaceSlug` provided.

```json
[
  {
    "id": "xxxxxxx",
    "version": 2,
    "created": "2017-02-21T13:26:28.951Z",
    "createdBy": "",
    "url": null,
    "slug": "newslug",
    "workspaceId": "yyyyyyyyy",
    "lastSeen": "0001-01-01T00:00:00Z",
    "collaborators": null,
    "readKeys": [
      "1231231231231231231231231231"
    ],
    "writeKeys": [
      "345345345345345345345353453451"
    ],
    "plan": null,
    "timezone": "America/Los_Angeles",
    "name": "newname",
    "sourceId": "U9mT0bPcI6",
    "enabled": true,
    "settings": null,
    "advancedSync": null
  },
  {
    "id": "zzzzzzzz",
    "version": 2,
    "created": "2017-02-21T02:52:53.499Z",
    "createdBy": "",
    "url": null,
    "slug": "nodejs",
    "workspaceId": "yyyyyyy",
    "lastSeen": "0001-01-01T00:00:00Z",
    "collaborators": null,
    "readKeys": [
      "1231231231231231231231231232"
    ],
    "writeKeys": [
      "345345345345345345345353453452"
    ],
    "plan": null,
    "timezone": "America/Los_Angeles",
    "name": "Nodejs",
    "sourceId": "U9mT0bPcI6",
    "enabled": true,
    "settings": null,
    "advancedSync": null
  }
]
```
<a name="getSource"></a>
### manage.getSource(workspaceSlug, name)

Return a promise that resolve to a source object in the `workspaceSlug` provided.

```json
{
  "id": "tttttttt",
  "created": "2017-02-21T13:26:28.951007525Z",
  "createdBy": "",
  "url": null,
  "slug": "newslug",
  "workspaceId": "gggggggg",
  "lastSeen": "0001-01-01T00:00:00Z",
  "collaborators": [],
  "readKeys": [
    "123123123123123123123123123"
  ],
  "writeKeys": [
    "34534534534534534534535345345"
  ],
  "timezone": "America/Los_Angeles",
  "name": "changedName",
  "sourceId": "sourceID",
  "enabled": true,
  "settings": null,
  "advancedSync": null,
  "workspace": {
    "id": "tttttttt",
    "created": "2017-02-21T13:26:28.951007525Z",
    "slug": "workspace-slug",
    "name": "WorkspaceSlug",
    "salesforce": null,
    "owners": [
        "xxxxxxxx"
    ],
    "features": null,
    "readKeys": [
        "123123123123123123123123123"
    ],
    "environment": null,
    "ids": null
  },
  "hasSentData": true,
  "integrations": []
}
```

<a name="deleteSource"></a>
### manage.deleteSource(workspaceSlug, sourceSlug)

* `workspaceSlug`: workspace slug
* `sourceSlug`: slug of the source to delete

Return a promise that resolve to:
```
HTTP 203 - Non-authoritative Information
```

<a name="getIntegrationMetadata"></a>
### manage.getIntegrationMetadata([integrationSlug])

Return a promise that resolve to an Array of available Integrations or a specific integration object if `integrationSlug` is provided.

```json
[
  {
    "name": "Gauges",
    "slug": "gauges",
    "version": "",
    "createdAt": "2013-01-14T03:00:46Z",
    "note": "",
    "website": "http://gaug.es",
    "description": "Gauges is a simple, friendly analytics tool that is perfect for the basic tracking needs of small projects or personal blogs. And all of it's data is queried in real-time.",
    "level": 1,
    "categories": [
      "Analytics",
      "Realtime Dashboards"
    ],
    "platforms": {
      "browser": true,
      "mobile": false,
      "server": false
    },
    "methods": {
      "alias": false,
      "group": false,
      "identify": false,
      "pageview": true,
      "track": false
    },
    "basicOptions": [
      "siteId"
    ],
    "advancedOptions": [],
    "options": {
      "siteId": "Object"
    },
    "public": true,
    "redshift": false,
    "logos": {
      "default": "https://d3hotuclm6if1r.cloudfront.net/logos/gauges-default.png"
    },
    "components": [
      "Object"
    ],
    "owners": null,
    "replaySupported": false,
    "browserUnbundlingSupported": null,
    "minimumBrowserUnbundlingVersion": null,
    "browserUnbundlingChangelog": null,
    "browserUnbundlingIntegrationChangelog": null
  }
]
```
<a name="setIntegration"></a>
### manage.setIntegration

* `worskpaceSlug` slug of the workspace.
* `sourceSlug` slug of the source. Use `getSourceMetadata` to retrieve it.
* `integrationName` name of the integration. Use `getIntegrationMetadata` to retrieve it.
* `integrationSlug` slug of the integration.
* `data`
  * `enabled` Boolean
  * `settings` Object. Use `getIntegrationMetadata` to retrieve allowed options for the integration.

<a name="getIntegrationSettings"></a>
### manage.getIntegrationSettings

* `workspaceSlug` slug of the workspace.
* `sourceSlug` slug of the source. Use `getSourceMetadata` to retrieve it.

```json
[
  {
    "id":"PWHyG2912i",
    "version":"v1",
    "created":"2017-04-12T23:01:58.583Z",
    "enabled":true,
    "project":"OsUhSeiN81",
    "settings":{
      "apiKey":"xxxxxxxxxxxxx",
      "apiSecret":"xxxxxxxxxxxx",
      "direct":false,
      "endpoint":"https://segment.app-us1.com/in.php"
    },
    "encryptedSettings":null,
    "type":"ActiveCampaign",
    "key":"s3B2OhulRD",
    "components":{
      "browser":{
        "disabled":false
      }
    },
    "projects":null
  },
  {
    "id":"yWPvBuo4rA",
    "version":"v1",
    "created":"2017-04-12T21:38:41.814Z",
    "enabled":false,
    "project":"OsUhSeiN81",
    "settings":{
      "anonymizeIp":false,
      "classic":false,
      "contentGroupings":{},
      "dimensions":{},
      "domain":"",
      "doubleClick":false,
      "enhancedEcommerce":false,
      "enhancedLinkAttribution":false,
      "ignoredReferrers":[],
      "includeSearch":false,
      "metrics":{},
      "mobileTrackingId":"",
      "nonInteraction":false,
      "optimize":"",
      "reportUncaughtExceptions":false,
      "sampleRate":100,
      "sendUserId":false,
      "serversideClassic":false,
      "serversideTrackingId":"UA-XXXXXXXX-X",
      "siteSpeedSampleRate":1,
      "trackCategorizedPages":true,
      "trackNamedPages":true,
      "trackingId":""
    },
    "encryptedSettings":null,
    "type":"Google Analytics",
    "key":"WRSRaDGXiw",
    "components":null,
    "projects":null
  }
]
```

Returns all integrations configured for the given workspace, slug pair.

<a name="getBitToolMetadata"></a>
### manage.getBitToolMetadata([bitToolSlug])

Return a promise that resolve to an Array of available BitTools or a specific BitTool object if `bitToolSlug` is provided.

```json
[
  {
    "id": "ywKtSk10Th",
    "name": "BIME Analytics",
    "slug": "bime-analytics",
    "logo": "https://d3hotuclm6if1r.cloudfront.net/logos/bime-default.svg",
    "popularity": 0,
    "freeTrial": true,
    "website": "https://www.bimeanalytics.com/?utm_source=partnersegment&utm_medium=product&utm_campaign=sources",
    "createdAt": "2016-03-29T01:18:19.978Z",
    "description": "BIME helps you analyze and visualize the customer data you collect with Segment. Combine data, perform analysis, and share dashboards on the metrics you care about—no SQL required.",
    "tagline": "Analyze and visualize customer data from your website, product, database, and many other sources.",
    "connectLink": "https://www.bimeanalytics.com/segment.html?utm_source=partnersegment&utm_medium=product&utm_campaign=sources",
    "partnerLevel": "partner",
    "categories": [
      "business intelligence"
    ],
    "tags": [
      "Dashboards",
      "Drag-and-drop",
      "Sharing analysis",
      "SQL",
      "Quick set up"
    ],
    "coupon": {
      "code": "segment+bime",
      "description": "1 month free on your Big Data plan annual contract."
    },
    "media": [
      "Object",
      "Object"
    ],
    "owners": null
  }
]
```

<a name="getWarehouseMetadata"></a>
### manage.getWarehouseMetadata([wherehouseSlug])

Return a promise that resolve to an Array of available Wherehouses or a specific Wherehouse object if `wherehouseSlug` is provided.

```json
[
  {
    "id": "aea3c55dsz",
    "name": "Redshift",
    "slug": "redshift",
    "createdAt": "0001-01-01T00:00:00Z",
    "description": "Powered by Amazon Web Services",
    "frequency": 7200,
    "public": true,
    "options": {
      "ciphertext": {},
      "database": {},
      "disable-extra-permissioning": "Object",
      "hostname": {},
      "password": {},
      "port": {},
      "username": {}
    },
    "logos": {
      "default": "https://d3hotuclm6if1r.cloudfront.net/logos/redshift-default.svg"
    }
  }
]
```

<a name="createWarehouse"></a>
### manage.createWarehouse(workspaceSlug, warehouseId, data)

* `workspaceSlug`: Workspace slug
* `warehouseId`: Id of the warehouse you want to connect with. Use getWarehouseMetadata().
* `settings`
  * `username`: Database username.
  * `password`: Database password.
  * `host`: Database host.
  * `port`: Database port
  * `database`: Database name.
* `databaseId`: Type Id for the database

<a name="getBillingCounts"></a>
### manage.getBillingCounts(workspaceSlug)

Return a promise that resolve to a billing count object for the `workspaceSlug` provided.

```json
{
  "workspace_id": "xxxxxxx",
  "period": "2017-02-01T00:00:00Z",
  "counts": {
    "anonymous": 0,
    "users": 1
  }
}
```

<a name="getBilling"></a>
### manage.getBilling(workspaceSlug)

Return a promise that resolve to a billing object for the `workspaceSlug` provided.

```json
{
  "workspaceId": "xxxxxxx",
  "customerId": "cus_yyyyyyyyy",
  "description": "",
  "email": "memail@example.com",
  "extraInfo": "",
  "card": null,
  "services": {},
  "legacy": false,
  "subscription": {
    "id": "sub_uuuuuuuu",
    "plan": {
      "id": "developer",
      "name": "Developer",
      "amount": 0,
      "interval": "month",
      "description": "",
      "level": 1,
      "quota": "Object",
      "version": 3
    },
    "quantity": 1,
    "status": "active",
    "trial": false,
    "trialStart": null,
    "trialEnd": null,
    "periodStart": "2017-02-20T23:24:35Z",
    "periodEnd": "2017-03-01T00:00:00Z",
    "coupon": null
  },
  "quota": {
    "trackedObjects": 1000
  },
  "usage": {
    "trackedObjects": 1
  },
  "needsUpgrade": false,
  "suggestedPlan": null
}
```
