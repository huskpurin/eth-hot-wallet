## Requirements Before Started

### Geth Client

* Verion >= 1.5 (personal_sendTransaction)
* Enable the HTTP-RPC server
* Offer the following APIs over the HTTP-RPC interface
  * `eth`
  * `web3`
  * `admin`: for `admin_nodeInfo`
  * `miner`: for `miner_start`, `miner_stop`
  * `personal`: for `personal_sendTransaction`

For example:

```
$ geth --rpc --rpcapi="eth,web3,admin,miner,personal"
```

### Node.js

* Version >= 8.0.0

## Get Started

* run `npm install` or `yarn` to install all required dependencies
* edit `local.json` to update your geth http rpc interface provider
* run `npm run start:dev` or `yarn start:dev` to start the local server

## APIs

Please move on [API Page](API.md).
