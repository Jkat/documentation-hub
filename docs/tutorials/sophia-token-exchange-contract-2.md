# TUTORIAL: Simple Fungible Token Exchange Smart Contract - Part 2
## Tutorial Overview
The second part of the tutorial will show you how to interact with our ExchangeContract created in the previous article using the step-by-step approach. It will teach you how to use the aecli commands and the forgae tool to decode a base58 addresses, deploy a contract with and without parameter and call a deployed contract functions.

## Prerequisites
- Created the two contracts ```FungibleToken.aes``` and ```ExchangeContract.aes``` from the first part - [Simple Fungible Token Exchange Smart Contract - Part 1](https://github.com/aeternity/tutorials/blob/master/sophia-token-exchange-contract-1.md)

## Content

In this tutorial we will deploy two fungible token contracts on the local network and will deploy a simple fungible token exchange contract created in the previous part. The ```ExchangeContract``` will store the addresses of the token contracts and their exchange rate. The exchange function will transfer the first token type(hereafter called receivingToken) from caller to exchange contract and after that will transfer the second token type(hereafter called sendingToken) from exchange contract to caller, based on the stated rate. 

## Execution plan

I will show you two ways how to interact with the ```ExchangeContract```.
The first approach(Manual) will be shown in this tutorial and will include:
- step-by-step commands which will let us know in details how to:
    - decode a base58 address to hex string via **aecli**;
    - deploy a contract with and without parameters;
    - call a deployed contract functions through **aecli**;
    
The second approach(Scripted) will be shown in [Simple Fungible Token Exchange Smart Contract - Part 3](https://github.com/aeternity/tutorials/blob/master/sophia-token-exchange-contract-3.md) and will include:
- building a script which will pack all of the above commands in one place;

*Please start with the first approach. This will help you understand the next one.*

## Manual approach

### Start your local development network

```
forgae node
```
At the end of this command we will be presented with accounts that we can use in our tests.
The result of the above command should be:
```
===== Starting node =====
.Starting fungible-token_proxy_1 ...
Starting fungible-token_node3_1 ...
Starting fungible-token_proxy_1 ... done
Starting fungible-token_node1_1 ... done
Starting fungible-token_node2_1 ... done
.

.............................
===== Node was successfully started! =====
===== Funding default wallets! =====
Miner ------------------------------------------------------------
public key: ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU
private key: bb9f0b01c8c9553cfbaf7ef81a50f977b1326801ebf7294d1c2cbccdedf27476e9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca
Wallet's balance is 7667346699999999999999994
#0 ------------------------------------------------------------
public key: ak_fUq2NesPXcYZ1CcqBcGC3StpdnQw3iVxMA3YSeCNAwfN4myQk
private key: 7c6e602a94f30e4ea7edabe4376314f69ba7eaa2f355ecedb339df847b6f0d80575f81ffb0a297b7725dc671da0b1769b1fc5cbe45385c7b5ad1fc2eaf1d609d
Wallet's balance is 40000000000000000
#1 ------------------------------------------------------------
public key: ak_tWZrf8ehmY7CyB1JAoBmWJEeThwWnDpU4NadUdzxVSbzDgKjP
private key: 7fa7934d142c8c1c944e1585ec700f671cbc71fb035dc9e54ee4fb880edfe8d974f58feba752ae0426ecbee3a31414d8e6b3335d64ec416f3e574e106c7e5412
Wallet's balance is 40000000000000000
#2 ------------------------------------------------------------
public key: ak_FHZrEbRmanKUe9ECPXVNTLLpRP2SeQCLCT6Vnvs9JuVu78J7V
private key: 1509d7d0e113528528b7ce4bf72c3a027bcc98656e46ceafcfa63e56597ec0d8206ff07f99ea517b7a028da8884fb399a2e3f85792fe418966991ba09b192c91
Wallet's balance is 40000000000000000
#3 ------------------------------------------------------------
public key: ak_RYkcTuYcyxQ6fWZsL2G3Kj3K5WCRUEXsi76bPUNkEsoHc52Wp
private key: 58bd39ded1e3907f0b9c1fbaa4456493519995d524d168e0b04e86400f4aa13937bcec56026494dcf9b19061559255d78deea3281ac649ca307ead34346fa621
Wallet's balance is 40000000000000000
#4 ------------------------------------------------------------
public key: ak_2VvB4fFu7BQHaSuW5EkQ7GCaM5qiA5BsFUHjJ7dYpAaBoeFCZi
private key: 50458d629ae7109a98e098c51c29ec39c9aea9444526692b1924660b5e2309c7c55aeddd5ebddbd4c6970e91f56e8aaa04eb52a1224c6c783196802e136b9459
Wallet's balance is 40000000000000000
#5 ------------------------------------------------------------
public key: ak_286tvbfP6xe4GY9sEbuN2ftx1LpavQwFVcPor9H4GxBtq5fXws
private key: 707881878eacacce4db463de9c7bf858b95c3144d52fafed4a41ffd666597d0393d23cf31fcd12324cd45d4784d08953e8df8283d129f357463e6795b40e88aa
Wallet's balance is 40000000000000000
#6 ------------------------------------------------------------
public key: ak_f9bmi44rdvUGKDsTLp3vMCMLMvvqsMQVWyc3XDAYECmCXEbzy
private key: 9262701814da8149615d025377e2a08b5f10a6d33d1acaf2f5e703e87fe19c83569ecc7803d297fde01758f1bdc9e0c2eb666865284dff8fa39edb2267de70db
Wallet's balance is 40000000000000000
#7 ------------------------------------------------------------
public key: ak_23p6pT7bajYMJRbnJ5BsbFUuYGX2PBoZAiiYcsrRHZ1BUY2zSF
private key: e15908673cda8a171ea31333538437460d9ca1d8ba2e61c31a9a3d01a8158c398a14cd12266e480f85cc1dc3239ed5cfa99f3d6955082446bebfe961449dc48b
Wallet's balance is 40000000000000000
#8 ------------------------------------------------------------
public key: ak_gLYH5tAexTCvvQA6NpXksrkPJKCkLnB9MTDFTVCBuHNDJ3uZv
private key: 6eb127925aa10d6d468630a0ca28ff5e1b8ad00db151fdcc4878362514d6ae865951b78cf5ef047cab42218e0d5a4020ad34821ca043c0f1febd27aaa87d5ed7
Wallet's balance is 40000000000000000
#9 ------------------------------------------------------------
public key: ak_zPoY7cSHy2wBKFsdWJGXM7LnSjVt6cn1TWBDdRBUMC7Tur2NQ
private key: 36595b50bf097cd19423c40ee66b117ed15fc5ec03d8676796bdf32bc8fe367d82517293a0f82362eb4f93d0de77af5724fba64cbcf55542328bc173dbe13d33
Wallet's balance is 40000000000000000
```

### Deploying two fungible token contracts on the local network

In the previous tutorial we deployed a token contract via forgae. We will use the same approach here.Let's update our deployment script which is located at ```~/exchange-contract/deployment/deploy.js```.

We have to change the contract path  from```./contracts/ExampleContract.aes``` to ```./contracts/FungibleToken.aes```.  The **deploy.js** file should now look like this:

```
const Deployer = require('forgae').Deployer;

const deploy = async (network, privateKey) => {
	let deployer = new Deployer(network, privateKey);

	await deployer.deploy("./contracts/FungibleToken.aes");
};

module.exports = {
	deploy
};
```

#### Deploying Receiving token

Next step is to run our deploy command: 

```
forgae deploy
```

The structure of the output you can expect looks something like this:

```
===== Contract: FungibleToken.aes has been deployed =====
{ owner: 'ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU',
  transaction: 'th_zXYbgU5NVMHif4LEKqHUbe1Yw4s72mqXGeYt1LSq3awDGQRhs',
  address: 'ct_CF7R6Q8VSirY2MguEi8ukGWMStUFGiNXzpbo1KST4gNNvCiD5',
  call: [Function],
  callStatic: [Function],
  createdAt: 2019-01-21T12:46:58.361Z }
Your deployment script finished successfully!
```
Аeternity command line interface accepts parameters of type address as hex string. So we have to decode the base58 contract address to hex string and add prefix ```0x``` - in my case **ct_CF7R6Q8VSirY2MguEi8ukGWMStUFGiNXzpbo1KST4gNNvCiD5** to this format **0x19877d65b8e253d10e7b0319a45191b7ef8919b6d73551d4dbdb3b1a59f4eb3c**.

```
aecli crypto decode ct_CF7R6Q8VSirY2MguEi8ukGWMStUFGiNXzpbo1KST4gNNvCiD5
Decoded address (hex): 19877d65b8e253d10e7b0319a45191b7ef8919b6d73551d4dbdb3b1a59f4eb3c
```
Prepending `0x` and we get:
```
0x19877d65b8e253d10e7b0319a45191b7ef8919b6d73551d4dbdb3b1a59f4eb3c
```
The above address will be used as the contract address function parameter via **aecli**.
Interacting with the functions of the deployed first token contract will be done using the base58 format - in my case `ct_CF7R6Q8VSirY2MguEi8ukGWMStUFGiNXzpbo1KST4gNNvCiD5`. 

#### Deploying Sending token

Let's repeat the deployment procedure for our second fungible token type(sendingToken).
The deployment script remains the same.
```
forgae deploy
```

```
===== Contract: FungibleToken.aes has been deployed =====
{ owner: 'ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU',
  transaction: 'th_2E61F7Xbho25x8sGWinn2mRjPMMu5o3uysWt3vbKmahnpCwgUH',
  address: 'ct_q1cKXEbgxJ6WmUTQwrSdsCZsbB8ygUV6Pk8TpFwBsujkNSRme',
  call: [Function],
  callStatic: [Function],
  createdAt: 2019-01-21T12:46:59.614Z }
Your deployment script finished successfully!
```
The second token type hex address representation in my case is:
```
aecli crypto decode ct_q1cKXEbgxJ6WmUTQwrSdsCZsbB8ygUV6Pk8TpFwBsujkNSRme
Decoded address (hex): 6d03829c7c61f395ab39aa0200e6849ff5916384d195ef4a77b0c597ba7ea245
```
*Please replace ```ct_q1cKXEbgxJ6WmUTQwrSdsCZsbB8ygUV6Pk8TpFwBsujkNSRme``` with the address of your deployed contract.*

```
0x6d03829c7c61f395ab39aa0200e6849ff5916384d195ef4a77b0c597ba7ea245
```
The above address will be used for passing the contract address as function parameter via **aecli**.
Interacting with the functions of the deployed second token contract will be done using the base58 format - in my case ```ct_q1cKXEbgxJ6WmUTQwrSdsCZsbB8ygUV6Pk8TpFwBsujkNSRme```.

#### Summary
Our two fungible token contracts have been deployed on the local network. 

The hex addresses for the two deployed token contracts in our case are:
```
Receiving token - 0x19877d65b8e253d10e7b0319a45191b7ef8919b6d73551d4dbdb3b1a59f4eb3c
Sending token - 0x6d03829c7c61f395ab39aa0200e6849ff5916384d195ef4a77b0c597ba7ea245
```

The base58 addresses:
```
Receiving token - ct_CF7R6Q8VSirY2MguEi8ukGWMStUFGiNXzpbo1KST4gNNvCiD5
Sending token - ct_q1cKXEbgxJ6WmUTQwrSdsCZsbB8ygUV6Pk8TpFwBsujkNSRme
```

### Building simple fungible token exchange contract

Let's create a new file ```ExchangeContract.aes``` in the`contracts` folder.

```
touch ./contracts/ExchangeContract.aes
```

*Keep in mind that the Sophia indentation should be using two spaces.*

Firstly, we will create an interface for FungibleToken contract. It will allow us to perform the ```transfer``` and ```transfer_from``` functions. The interface contract includes the signatures of both functions:

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
    rate            : int}

  public stateful function init(receiving_token: FungibleToken, sending_token: FungibleToken, rate: int) = {
    receiving_token = receiving_token,
    sending_token   = sending_token,
    rate            = rate}
```

The main function of our contracts is called ```exchange```. It accepts just one parameter - the amount of tokens which we want to exchange.
```
public function exchange(value: int) : bool =
  state.receiving_token.transfer_from(Call.caller, Contract.address, value)
  state.sending_token.transfer(Call.caller, value * state.rate)
  true
```

There are two ways to send tokens from one address to another: 
- the transfer() function transfers a number of tokens directly from the message sender to another address;
- approve() and transfer_from() are two functions that allow the transfer to work using a two-step process. In the first step a token holder gives another address (usually of a contract) approval to transfer up to a certain number of tokens, known as an allowance. The token holder uses approve() to provide this information.

The first line of our ```exchange``` function transfers previously approved tokens(receivingToken) from caller to еxchange contract.
Next line transfers the second type tokens(sendingToken) from exchange contract to caller.

#### Sophia exchange contract code

The code shown here is our Sophia exchange contract:

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

### Deploying the Exchange Sophia contract

The exchange contract accepts three parameters at deployment time:
- receivingToken;
- sendingToken;
- rate;

Let's change our deploy script to add parameters. The parameters of the init functions are always passed as tuple. Here is how our new deploy script deploy function looks like:
```
const Deployer = require('forgae').Deployer;

const deploy = async (network, privateKey) => {
	let deployer = new Deployer(network, privateKey);
	const receivingTokenAddress = "0x19877d65b8e253d10e7b0319a45191b7ef8919b6d73551d4dbdb3b1a59f4eb3c";
	const sendingTokenAddress = "0x6d03829c7c61f395ab39aa0200e6849ff5916384d195ef4a77b0c597ba7ea245";
	const rate = 2;

	await deployer.deploy("./contracts/ExchangeContract.aes", undefined, `(${receivingTokenAddress}, ${sendingTokenAddress}, ${rate})`);
};

module.exports = {
	deploy
};
```

*Please replace the token addresses with yours.*

As you can see, we passed the token addresses and the exchange rate. Let's set the exchange rate to 2, which means if we want to exchange 5 token of the first type, we will receive 10 of the second type.

Let's run our deploy script:
```
forgae deploy
```

```
===== Contract: ExchangeContract.aes has been deployed =====
{ owner: 'ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU',
  transaction: 'th_rscBoiBkPyfYKAAU5e6Bby1MLVyxSMc5y1Ub4FKEhnbQ26zXK',
  address: 'ct_Lu9XYdtkDbTSJuadtMXkJHe2ybrF5dPAK973AMEURyZkMUEZw',
  call: [Function],
  callStatic: [Function],
  createdAt: 2019-01-21T12:47:00.804Z }
Your deployment script finished successfully!
```

I will decode the deployed contract address ```ct_Lu9XYdtkDbTSJuadtMXkJHe2ybrF5dPAK973AMEURyZkMUEZw```:
```
aecli crypto decode ct_Lu9XYdtkDbTSJuadtMXkJHe2ybrF5dPAK973AMEURyZkMUEZw
Decoded address (hex): 2d2eed67337a96e2f0819cf6cdf754947dbd6ac95659a84e656b0fb85617047
```
The result is ```0x2d2eed67337a96e2f0819cf6cdf754947dbd6ac95659a84e656b0fb85617047```. Please do the same for your exchange contract address.

### Interacting with the exchange contract
The exchange mechanism is as follows - the exchange contract accepts *receiving* tokens and returns *sending* token multiplied by the rate.

Here is a reminder of how looks the exchange function of the ExchangeContract:
```
public function exchange(value: int) : bool =
  state.receiving_token.transfer_from(Call.caller, Contract.address, value)
  state.sending_token.transfer(Call.caller, value * state.rate)
  true
```

In order to be able to achieve token exchange, we have to:
- mint *receiving* tokens to our caller account;
- mint *sending* tokens to our ExchangeContract;
- give permission to ExchangeContract to spend some amount of the *receiving* tokens owned by caller account;
- execute the exchange function of ExchangeContract;
- check the caller account balance of the receiving and sending tokens;

First of all, let's mint some receiving tokens to our caller account. In order to do that we would need hex representation of the miner account:
```
aecli crypto decode ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU
Decoded address (hex): e9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca
```

Interacting with a deployed contract is done using ```aecli contract call```. 

We have to create a wallet file for the *miner* account to be able to call contract functions. 
We will use the ```aecli account save``` command. It generates a keypair file from private key and encrypt it by password.
The whole command looks like this:
```
aecli account save owner-wallet bb9f0b01c8c9553cfbaf7ef81a50f977b1326801ebf7294d1c2cbccdedf27476e9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca --password 12345
```

- owner-wallet - the name of the wallet file;
- private key of the miner account;
- encryption password;

The result should be similar to:
```
    Wallet saved
    Wallet address________________ ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU
    Wallet path___________________ ~/exchange-contract/owner-wallet
```

For instance, calling of the *mint* function of our first fungible token contract looks like this:

```
aecli contract call <wallet_file> --password <wallet_password> 
mint bool <account_address> <created_token_amount> 
--contractAddress <deployed_contract_address> 
-u http://localhost:3001 
--internalUrl http://localhost:3001/internal --networkId ae_devnet
```  
In my case the above command looks like this:
```
aecli contract call ./owner-wallet --password 12345 
mint bool 0xe9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca 100 
--contractAddress ct_CF7R6Q8VSirY2MguEi8ukGWMStUFGiNXzpbo1KST4gNNvCiD5 
-u http://localhost:3001 
--internalUrl http://localhost:3001/internal --networkId ae_devnet
```

We are calling the mint function of the first deployed fungible token with address - ```ct_CF7R6Q8VSirY2MguEi8ukGWMStUFGiNXzpbo1KST4gNNvCiD5```. We want to mint 100 tokens of the *receiving* type.

Our caller account has **100** tokens of type *receiving*.

Next step is to mint tokens of the *sending* type to ExchangeContract. We will call the mint function of the token contract with *sending* type(contract address - ```ct_q1cKXEbgxJ6WmUTQwrSdsCZsbB8ygUV6Pk8TpFwBsujkNSRme```). The minted tokens will be assigned to the address of ExchangeContract, in my case - ```0x2d2eed67337a96e2f0819cf6cdf754947dbd6ac95659a84e656b0fb85617047```.
I will apply my addresses to the structure of mint function described above: 

```
aecli contract call ./owner-wallet --password 12345 
mint bool 0x2d2eed67337a96e2f0819cf6cdf754947dbd6ac95659a84e656b0fb85617047 
1000 
--contractAddress ct_q1cKXEbgxJ6WmUTQwrSdsCZsbB8ygUV6Pk8TpFwBsujkNSRme 
-u http://localhost:3001 
--internalUrl http://localhost:3001/internal --networkId ae_devnet
```

*Please replace the address of your deployed ExchangeContract as hex string and the address of deployed second token type(sending) as base58.*

The above command shows how to mint 1000 tokens of the second(sendingToken) type.

Our exchange contract has **1000** sending tokens now.

In order to be able to perform the ```transfer_from``` function of FungibleToken contract our Exchange contract has to have permission to spend some amount of the first token type(receiving).

```
aecli contract call ./owner-wallet --password 12345 
approve bool 0x2d2eed67337a96e2f0819cf6cdf754947dbd6ac95659a84e656b0fb85617047 
50  
--contractAddress ct_CF7R6Q8VSirY2MguEi8ukGWMStUFGiNXzpbo1KST4gNNvCiD5 
-u http://localhost:3001 
--internalUrl http://localhost:3001/internal --networkId ae_devnet
```

The above command shows how we as caller with address ```0xe9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca``` and as owner of **100** *receiving* tokens give permission to the ExchangeContract with address ```0x2d2eed67337a96e2f0819cf6cdf754947dbd6ac95659a84e656b0fb85617047``` to spend **50** of our *receiving* tokens.

Our account is the owner of **100** *receiving* tokens. Our goal is to call the exchange function of the Exchange contract and to receive tokens of the *sending* type based on our passed amount and the exchange rate.

The execution of the exchange function is as follows: 
```
aecli contract call ./owner-wallet --password 12345 
exchange bool 5 
--contractAddress ct_Lu9XYdtkDbTSJuadtMXkJHe2ybrF5dPAK973AMEURyZkMUEZw 
-u http://localhost:3001 
--internalUrl http://localhost:3001/internal --networkId ae_devnet
```

We want to exchange **5** of our *receiving* tokens for *sending* ones.
So let's check the balance of our account.
First the *receiving* tokens balance:

```
aecli contract call ./owner-wallet --password 12345 
balance_of int 0xe9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca 
--contractAddress ct_CF7R6Q8VSirY2MguEi8ukGWMStUFGiNXzpbo1KST4gNNvCiD5 
-u http://localhost:3001 
--internalUrl http://localhost:3001/internal --networkId ae_devnet
```

```--contractAddress ct_CF7R6Q8VSirY2MguEi8ukGWMStUFGiNXzpbo1KST4gNNvCiD5 ``` is the address of our *receiving* token contract.

The result of the above command is: 
```
Contract address_________ ct_CF7R6Q8VSirY2MguEi8ukGWMStUFGiNXzpbo1KST4gNNvCiD5
Gas price________________ 1
Gas used_________________ 1920
Return value (encoded)___ cb_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF+2YqXM
Return value (decoded)___ 95
Return remote type_______ word
```
The returned value is **95** *receiving* tokens. 5 of our previous amount of 100 tokens are transferred from caller to exchange contract with the first line of our ```exchange``` function - ```state.receiving_token.transfer_from(Call.caller, Contract.address, value)```. So let's check the balance of the second token type.

```
aecli contract call ./owner-wallet --password 12345 
balance_of int 0xe9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca 
--contractAddress ct_q1cKXEbgxJ6WmUTQwrSdsCZsbB8ygUV6Pk8TpFwBsujkNSRme 
-u http://localhost:3001 
--internalUrl http://localhost:3001/internal --networkId ae_devnet
```

The result is:
```
Contract address_________ ct_q1cKXEbgxJ6WmUTQwrSdsCZsbB8ygUV6Pk8TpFwBsujkNSRme
Gas price________________ 1
Gas used_________________ 1920
Return value (encoded)___ cb_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABX4y1tk
Return value (decoded)___ 10
Return remote type_______ word
```
As you can see the returned value is **10** tokens of our second type(sendingToken).

Our account balance before exchange: 
- **100** *receiving* tokens;
- **0** *sending* tokens;

The balance after exchange:
- **95** *receiving* tokens;
- **10** *sending* tokens;


## What is next?
As you can see, this approach requires some degree of manual work. In the next [Part 3](https://github.com/aeternity/tutorials/blob/master/sophia-token-exchange-contract-3.md), we automate decoding and deployment through the use of forgae deployment scripts.

The æternity team will keep this tutorial updated. If you encounter any problems please contact us through the [æternity Forum](https://forum.aeternity.com/c/development).

