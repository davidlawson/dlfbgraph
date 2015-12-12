'use strict';

var _streamline = typeof require === 'function' ? require('streamline-runtime/lib/fibers/runtime') : Streamline.require('streamline-runtime/lib/fibers/runtime');

var _filename = '/Users/david/Developer/Tori/dlfbgraph/index._js';

var nop = function nop() {};

/**
 * index.js
 */

/* === Imports === */

var graph = require('fbgraph');
var OAuth2 = require('oauth').OAuth2;

graph.errorLogger = nop;
graph.callLogger = nop;
graph.resultLogger = nop;

graph.oauthInstance = null;

/* === Setup === */

graph.setVersion('2.5');

/* === Methods === */

var graphGet = graph.get;
graph.get = _streamline.async(function _$$wrappedGet$$(url, _) {
  {
    this.callLogger('graph.get(' + url + ')');

    try {
      var result = _streamline.await(_filename, 31, null, graphGet.bind(graph), 1, null, false)(url, true);
      this.resultLogger('FB Graph API call to ' + url + ' returned:', result);
      return result;
    } catch (ex) {
      // If the token has expired
      if (ex.code === 190) {
          this.errorLogger('Facebook token expired, attempting to re-authenticate...');
          _streamline.await(_filename, 41, this, 'reauthenticate', 0, null, false)(true);
          _streamline.await(_filename, 42, graph, 'get', 1, null, false)(url, true);
        } else {
          throw ex;
        }
    }
  }
}, 1, 2);

graph.authenticate = _streamline.async(function _$$authenticate$$(appID, appSecretKey, _) {
  {
    this.oauthInstance = new OAuth2(appID, appSecretKey, 'https://graph.facebook.com/');

    _streamline.await(_filename, 59, this, 'reauthenticate', 0, null, false)(true);
  }
}, 2, 3);

graph.reauthenticate = _streamline.async(function _$$reauthenticate$$(_) {
  {
    if (!this.oauthInstance) {
        throw new Error('Attempting to re-authenticate with Facebook with no credentials stored');
      }

    var token = _streamline.await(_filename, 69, this.oauthInstance, 'getOAuthAccessToken', 2, null, false)('', { grant_type: 'client_credentials' }, true);

    this.setAccessToken(token);
  }
}, 0, 1);

graph.itemGenerator = _streamline.async(function _$$itemGenerator$$(startURL, _) {
  {
    return this.existingItemGenerator(_streamline.await(_filename, 80, this, 'get', 1, null, false)(startURL, true));
  }
}, 1, 2);

graph.existingItemGenerator = function existingItemGenerator(existingItem) {
  return {
    response: existingItem,
    next: _streamline.async(function _$$next$$(_) {
      {
        if (this.response.data.length > 0) {
            return this.response.data.shift();
          } else if (this.response.paging && this.response.paging.next) {
            this.response = _streamline.await(_filename, 95, this, 'get', 1, null, false)(this.response.paging.next, true);
            return this.response.data.shift();
          }
      }
    }, 0, 1)
  };
};

module.exports = graph;
// eslint-disable-line camelcase
//# sourceMappingURL=index.map