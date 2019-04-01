# TUTORIAL: Simple Fungible Token Exchange Smart Contract - Part 1
## Tutorial Overview
This tutorial series will simultaneously teach you some of the needed skills when working with Fungible tokens and set you up for future tutorials on Crowdsales. The Exchange smart contract that we are going to go through, is both an amazing example of how one uses Fungible tokens programmatically, and allows you to start specifying exchanging logic between different value systems (Tokens, AE, etc.)

## When would one want to apply similar exchange logic
Here are some use cases of token exchange logic:
### Decentralized Exchanges
Every decentralized exchange would need to be able to "convert" one token to another. This happens in accordance to some rules - normally exchange rates. Our example will teach you how you can create this mechanism to exchange two Fungible tokens in accordance to a given exchange rate.

### Crowdsales
Generally, every crowdsale is just an exchange between a native currency (AE, USD, ETH) and a newly created Fungible token. You can swap one of our tokens with AE and you have half of what is needed in order to create a crowdsale.

### Addition: Oracles
One of the main benefits of Aeternity is the inbuilt support for Oracles. Exchange contracts combined with Oracles creates a robust Oracle-regulated system. For example, an Oracle might be updating your exchange smart contract, with the exchange rate between your Fungible token and AE, in accordance with off-chain factors.
## Prerequisites
- Deployed and tested contract from our previous tutorial - [How to create a Sophia fungible token contract?](https://dev.aepps.com/tutorials/sophia-fungible-token-contract.html)

## Plan 
We will separate the tutorial in three parts. 
Firstly we will create two contracts - ```FungibleToken.aes``` and ```ExchangeContract.aes```. 
The second and the third parts will show us two approaches(```Manual``` and ```Scripted```) how to:
- decode a base58 address to hex string;
- deploy a contract with and without parameters;
- call a deployed contract's functions;

## Fungible token and simple fungible token exchange smart contracts

### Getting started

The first thing we need to do is create a project folder and initialize its structure.

Let's create a folder for our project:
```
mkdir ~/exchange-contract
```

Go to the newly created folder and initialize the æpp:
```
cd ~/exchange-contract
forgae init
```

### Fungible token contract

The ```init``` command creates an æpp structure with several directories and scripts. 
Let's create a new file **FungibleToken.aes** in the *contracts* directory. 

```
touch ./contracts/FungibleToken.aes
```

Go to the [fungible token code](https://dev.aepps.com/tutorials/sophia-fungible-token-contract.html) section from the previous tutorial and copy the code into the newly created file.

### Fungible token exchange contract

Let's create a new file ```ExchangeContract.aes``` in the `contracts` folder.

```
touch ./contracts/ExchangeContract.aes
```

*Keep in mind that the Sophia indentation should be using two spaces.*

First, we will create an interface for the ```FungibleToken``` contract. It will allow us to perform the ```transfer``` and ```transfer_from``` functions. The interface contract includes the signatures of both functions:

```
contract FungibleToken =
  public function transfer : (address, int) => bool
  public function transfer_from : (address, address, int) => bool
``` 

Let's continue with ```ExchangeContract```. 
It will store:
- the addresses of the deployed fungible token contracts from the above section
- the exchange rate

At contract creation we will initialize the data.
```
contract FungibleToken =
  public function transfer : (address, int) => bool
  public function transfer_from : (address, address, int) => bool
  
contract ExchangeContract =
  record state = {
    receiving_token : FungibleToken,
    sending_token   : FungibleToken,
    rate           : int}

  public stateful function init(receiving_token: FungibleToken, sending_token: FungibleToken, rate: int) = {
    receiving_token = receiving_token,
    sending_token   = sending_token,
    rate           = rate}
```

The main function of our contracts is called ```exchange```. It accepts just one parameter - the amount of tokens which we want to exchange.
```
public function exchange(value: int) : bool =
  state.receiving_token.transfer_from(Call.caller, Contract.address, value)
  state.sending_token.transfer(Call.caller, value * state._rate)
  true
```

There are two ways to send tokens from one address to another: 
- the ```transfer()``` function transfers a number of tokens directly from the message sender to another address;
- ```approve()``` and ```transfer_from()``` are two functions that allow the transfer to work using a two-step process. In the first step a token holder gives another address (usually that of a contract) and approval to transfer up to a certain number of tokens, known as an allowance. The token holder uses ```approve()``` to provide this information.

The first line of our ```exchange``` function transfers previously approved ```tokens(receiving_token)``` from caller to еxchange contract.
The next line transfers the second type ```tokens(sending_token)``` from the exchange contract to the caller.

##### Sophia exchange contract code

The code below is our Sophia exchange contract:

```
contract FungibleToken =
  public function transfer : (address, int) => bool
  public function transfer_from : (address, address, int) => bool

contract ExchangeContract =
  record state = {
    receiving_token : FungibleToken,
    sending_token   : FungibleToken,
    rate            : int}

  public stateful function init(receiving_token: FungibleToken, sending_token: FungibleToken, rate: int) = {
    receiving_token = receiving_token,
    sending_token   = sending_token,
    rate            = rate}

  public function exchange(value: int) : bool =
    state.receiving_token.transfer_from(Call.caller, Contract.address, value)
    state.sending_token.transfer(Call.caller, value * state.rate)
    true

```

## What is next?
In [Part 2](https://github.com/aeternity/tutorials/blob/master/sophia-token-exchange-contract-2.md) of the series we will learn some very valuable skills - decoding a base58 address, deploying a contract with and without parameters and calling a deployed contract. We will first walk through it manually and in [Part 3](https://github.com/aeternity/tutorials/blob/master/sophia-token-exchange-contract-3.md) we will do it with script.

The æternity team will keep this tutorial updated. If you encounter any problems please contact us through the [æternity Forum](https://forum.aeternity.com/c/development).

