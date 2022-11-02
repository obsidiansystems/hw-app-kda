# hw-app-kda

JavaScript bindings for [Kadena](https://kadena.io/) [Ledger App](https://github.com/obsidiansystems/ledger-app-kadena), based on [LedgerJS](https://github.com/LedgerHQ/ledgerjs).

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
    -   [signTransferTx, signTransferCreateTx and signTransferCrossChainTx](#signtransfertx-signtransfercreatetx-and-signtransfercrosschaintx)
        -   [Parameters](#parameters-2)
        -   [Examples](#examples-2)
    -   [signTransaction](#signtransaction)
        -   [Parameters](#parameters-3)
        -   [Examples](#examples-3)
    -   [getVersion](#signtransaction)
        -   [Parameters](#parameters-4)
        -   [Examples](#examples-4)
    -   [signHash](#signhash)
        -   [Parameters](#parameters-5)
        -   [Examples](#examples-5)

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

-   `path` **[string]()** a path in BIP-32 format

#### Examples

```javascript
const publicKey = await kadena.getPublicKey("44'/626'/0'/0/0");
```

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** an object with a public key.


### signTransferTx, signTransferCreateTx and signTransferCrossChainTx

These APIs signs a transfer transaction constructed from the input parameters and returns the Pact Command and the public key.

- `signTransferTx` is for a same chain transfer, when the recipient account already exists.

- `signTransferCreateTx` should be used if the recipient account does not exist on the chain.

This would create a "k:<recipient_pubkey>" account on the chain using the `coin.transfer-create` and the `keyset` `{"pred":"keys-all","keys":[<recipient_pubkey>]}`

- `signTransferCrossChainTx` should be used for cross-chain transfers.

The recipient's `keyset` on the target chain will be `{"pred":"keys-all","keys":[<recipient_pubkey>]}`

#### Parameters

An **[object][#object]>** containing the following fields

- `recipient` **[string][#string]** Public key or 'k:' account of the recipient.

  The recipient account will be the "k:<recipient_pubkey>". It is not possible to specify non-k recipient accounts.
  For sending to non-k accounts please use `signTransaction`
  
- `recipient_chainId` **[number][#number]** (required only for `signTransferCrossChainTx`).  Should be a number between 0 and 19, and different from `chainId`.

- `amount` **[string][#string]** Transfer amount.

- `chainId` **[number][#number]** Sender's chainId. Should be a number between 0 and 19.

- `network` **[string][#string]**

- `path` **[string][#string]** (Optional, default value = `"44'/626'/0'/0/0"`)

  Signing key's derivation path in BIP-32 format. Must be of the format `"44'/626'/<account>'/<change>/<address_index>"` 

- `gasPrice` **[string][#string]** (Optional, default value = "1.0e-6")

- `gasLimit` **[string][#string]** (Optional, default value = "2300")

- `creationTime` **[string][#string]** (Optional, default value = current time)

- `ttl` **[string][#string]** (Optional, default value = "600")

- `nonce` **[string][#string]** (Optional, default value = current time in UTC as string)


#### Examples

```javascript
const { pact_command, pubkey } = await kadena.signTransferTx({
  recipient: "k:b818be69f485c5bbd07ef916d31f6610fb74aba6ec87f7883b77fe0c3bbd20ad",
  amount: "23.456",
  chainId: 1,
  network: "mainnet01",
  });
```

```javascript
const { pact_command, pubkey } = await kadena.signTransferCreateTx({
  recipient: "k:b818be69f485c5bbd07ef916d31f6610fb74aba6ec87f7883b77fe0c3bbd20ad",
  amount: "23.456",
  chainId: 1,
  network: "mainnet01",
  });
```

```javascript
const { pact_command, pubkey } = await kadena.signTransferCrossChainTx({
  recipient: "k:b818be69f485c5bbd07ef916d31f6610fb74aba6ec87f7883b77fe0c3bbd20ad",
  recipient_chainId: 2,
  amount: "23.456",
  chainId: 1,
  network: "mainnet01",
  });
```

Returns **[Promise][#promise]&lt;[object][#object]>** an object containing following fields

- `pact_command` **[object][#object]>** Object containing `cmd`, `hash` and `sigs`
 Ref: https://api.chainweb.com/openapi/pact.html#tag/model-command

- `pubkey` **[string][#string]** hex encoded Pubkey which was used for signing the `cmd`

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

[#string]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[#number]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
[#object]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[#promise]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise
