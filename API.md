## APIs (v1)

### Node Info

* URL: `GET /api/v1/node`

### Block Info

* URL: `GET /api/v1/block/:blockNumber`
* URL Parameters: blockNumber=[integer]
* Success Response:

`200 OK`

```
{
  "data": {
    "difficulty": "2",
    "gasLimit": 4712388,
    "gasUsed": 0,
    "hash": "0xdb4e0ec55d3d135fe15c098da1a080a3a37e3274301d34be62ce3e7ef3a0cebf",
    "miner": "0x0000000000000000000000000000000000000000",
    "parentHash": "0x8f2f04f29815cd08537b46b7a8526003dd9b84a653b8a3fbf05081bd062b945c",
    "totalDifficulty": "1960"
  }
}
```

### Transaction Info

* URL: `GET /api/v1/transaction/:transationHash`
* URL Parameters: transationHash=[string]
* Success Response:

`200 OK`

```
{
  "data": {
    "blockHash": "0x7e83b4e02086151c8352582a3b31094ae88313d1395bfc27d78f77ee0112bd19",
    "blockNumber": 2242724,
    "from": "0xa72ef478b64930eeace4fb0135ebdbc8044877bf",
    "gas": 90000,
    "gasPrice": "2000000000",
    "hash": "0x27ab352b89078f7590c03d6621fcfff05329af82c90162f997ae37d51e5226f4",
    "nonce": 22,
    "to": "0xe751240e51164d2c9881f0b879c493004b04246e",
    "value": "10000000000000000",
    "input": "0x7b22666f6f223a22626172227d"
  }
}
```

### Send Transaction

* URL: `POST /api/v1/transaction`
* Data constraints:
  * `from`: `String` - The address for the sending account.
  * `to`: `String` - (optional) The destination address of the message, left undefined for a contract-creation transaction.
  * `value`: `Number|String|BigNumber` - (optional) The value transferred for the transaction in Wei, also the endowment if it's a contract-creation transaction.
  * `gas`: `Number|String|BigNumber` - (optional, default: 90000) The amount of gas to use for the transaction (unused gas is refunded).
  * `gasPrice`: `Number|String|BigNumber` - (optional, default: `web3.eth.gasPrice`) The price of gas for this transaction in wei, defaults to the mean network gas price.
  * `data`: `String|Object` - (optional) Either a byte string containing the associated data of the message, or in the case of a contract-creation transaction, the initialisation code.
  * `privateKey`: `String` - (optional) The privateKey of the sending account.
  * `passphrase`: `String` - (optional) The passphrase of the sending account which should be one of personal account in node.

* Data Example:

```
{
	"from": "0xa72ef478b64930eeace4fb0135ebdbc8044877bf",
	"to": "0xe751240e51164d2c9881f0b879c493004b04246e",
	"value": 10000000000000000,
	"gas": 21000,
	"gasPrice": 20000000000,
	"data": "Hello World",
	"passphrase": "###passphrase###"
}
```

* Success Response:

`200 OK`

```
{
  "data": {
    "transactionHash": "0x27ab352b89078f7590c03d6621fcfff05329af82c90162f997ae37d51e5226f4"
  }
}
```

### Miner Start

* URL: `PUT /api/v1/transaction`
* Data constraints:
  * `cpus`: `Number` - (optional, default: 1)

* Success Response:

`204 No Content`

 ### Miner Stop

* URL: `DELETE /api/v1/transaction`
* Success Response:

`204 No Content`
