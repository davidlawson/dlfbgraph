# DLFBGraph

Facebook Graph API library built on top of [criso/fbgraph](https://github.com/criso/fbgraph).

## Installation
```
npm install --save davidlawson/dlfbgraph
```

## Features

* Log errors, calls and results using specified functions
* OAuth2 authentication (using [app token](https://developers.facebook.com/docs/facebook-login/access-tokens#apptokens))
* Re-authenticates on app token expiry
* Item 'generators'

## Usage

```js
const graph = require('dlfbgraph');
``` 

The following examples use [streamline.js](https://github.com/Sage/streamlinejs).

### Logging

```js
graph.errorLogger = console.error;
graph.callLogger = console.log;
graph.resultLogger = console.info;
```

### Authentication

```js
graph.authenticate(appID, appSecretKey, _);
```

### Item Generator

```js
const postGenerator = graph.itemGenerator('<facebookID>/posts?fields=...', _);

let postData = null, postsFound = 0, maxPosts = 10;
while (postsFound < maxPosts && (postData = postGenerator.next(_)))
{
  console.log(postData);
  postsFound++;
}
```

### Other

See [criso/fbgraph](https://github.com/criso/fbgraph).

## License

This library is available under the [MIT license](http://www.opensource.org/licenses/mit-license.php).
