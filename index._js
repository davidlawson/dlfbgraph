/**
 * index.js
 */

/* === Imports === */

const graph = require('fbgraph');
const OAuth2 = require('oauth').OAuth2;

function nop() {}

graph.errorLogger = nop;
graph.callLogger = nop;
graph.resultLogger = nop;

graph.oauthInstance = null;

/* === Setup === */

graph.setVersion('2.4');

/* === Methods === */

const graphGet = graph.get;
graph.get = function wrappedGet(url, _)
{
  this.callLogger(`graph.get(${url})`);

  try
  {
    const result = graphGet.bind(graph)(url, _);
    this.resultLogger(`FB Graph API call to ${url} returned:`, result);
    return result;
  }
  catch (ex)
  {
    // If the token has expired
    if (ex.code === 190)
    {
      this.errorLogger('Facebook token expired, attempting to re-authenticate...');
      this.reauthenticate(_);
      graph.get(url, _);
    }
    else
    {
      throw ex;
    }
  }
};

graph.authenticate = function authenticate(appID, appSecretKey, _)
{
  this.oauthInstance = new OAuth2(
    appID,
    appSecretKey,
    'https://graph.facebook.com/'
  );

  this.reauthenticate(_);
};

graph.reauthenticate = function reauthenticate(_)
{
  if (!this.oauthInstance)
  {
    throw new Error('Attempting to re-authenticate with Facebook with no credentials stored');
  }

  const token = this.oauthInstance.getOAuthAccessToken(
    '',
    { grant_type: 'client_credentials' }, // eslint-disable-line camelcase
    _
  );

  this.setAccessToken(token);
};

graph.itemGenerator = function itemGenerator(startURL, _)
{
  return this.existingItemGenerator(this.get(startURL, _));
};

graph.existingItemGenerator = function existingItemGenerator(existingItem)
{
  return {
    response: existingItem,
    next(_)
    {
      if (this.response.data.length > 0)
      {
        return this.response.data.shift();
      }
      else if (this.response.paging && this.response.paging.next)
      {
        this.response = this.get(this.response.paging.next, _);
        return this.response.data.shift();
      }
    }
  };
};

module.exports = graph;
