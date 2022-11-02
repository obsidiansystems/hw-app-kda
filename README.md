[Github](https://github.com/LedgerHQ/ledgerjs/),
[Ledger Devs Slack](https://ledger-dev.slack.com/)

# hw-app-kda

[Ledger Hardware Wallet](https://www.ledger.com/) JavaScript bindings for [Kadena](https://kadena.io/), based on [LedgerJS](https://github.com/LedgerHQ/ledgerjs).

## Using LedgerJS for Kadena

Here is a sample app for Node:

```javascript
const Transport = require("@ledgerhq/hw-transport").default;
const Kadena = require("hw-app-kda").default;

const getPublicKey = async () => {
  const kadena = new Kadena(await Transport.create());
  return await kadena.getPublicKey("44'/626'/0'/0/0");
};

const signTransaction = async () => {
  const transport = await Transport.create();
  const kadena = new Kadena(await Transport.create());
  return await kadena.signTransaction(
    "44'/626'/0'/0/0",
    "<transaction contents>"
  );
};

const getVersion = async () => {
  const transport = await Transport.create();
  const kadena = new Kadena(await Transport.create());
  return await kadena.getVersion();
};

const doAll = async () => {
  console.log(await getPublicKey());
  console.log(await signTransaction());
  console.log(await getVersion());
};

doAll().catch(err => console.log(err));
```

## API

### Table of Contents

-   [Kadena](#kadena)
    -   [Parameters](#parameters)
    -   [Examples](#examples)
    -   [getPublicKey](#getpublickey)
        -   [Parameters](#parameters-1)
        -   [Examples](#examples-1)
    -   [signTransaction](#signtransaction)
        -   [Parameters](#parameters-2)
        -   [Examples](#examples-2)
    -   [getVersion](#signtransaction)
        -   [Parameters](#parameters-3)
        -   [Examples](#examples-3)


### Parameters

-   `transport` **`Transport<any>`**
-   `scrambleKey` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**  (optional, default `"Kadena"`)

### Examples

```javascript
import Kadena from "hw-app-kda";
const kadena = new Kadena(transport);
```

### getPublicKey

Get Kadena address for a given BIP-32 path.

#### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** a path in BIP-32 format

#### Examples

```javascript
const publicKey = await kadena.getPublicKey("44'/626'/0'/0/0");
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** an object with a public key.


### signTransaction

Sign a transaction with a given BIP-32 path.

#### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** a path in BIP-32 format

#### Examples

```javascript
const publicKey = await kadena.signTransaction(
  "44'/626'/0'/0/0",
  "<transaction contents>"
  );
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** an object with text field containing a signature.

### getVersion

Get the version of the application installed on the hardware device.

#### Examples

```javascript
console.log(await kadena.getVersion());
```

for version 0.1.0, it produces something like

```
{
  major: 0
  minor: 1
  patch: 0
}
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;{[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)}>** an object with major, minor, and patch of the version.


### signHash

Sign any arbitrary hash with a given BIP-32 path.
This requires Kadena Ledger app v0.2.1 above, and hash signing must be enabled from the settings menu.

#### Parameters

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** a path in BIP-32 format

#### Examples

```javascript
const publicKey = await kadena.signHash(
  "44'/626'/0'/0/0",
  "<hash, encoded as a hex string of length 64>"
  );
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** an object with text field containing a signature.
