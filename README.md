#BikeDeed

`BikeDeed.sol` is an implementation of the latest draft of the ERC721 standard.

A mostly functional MVP can be found here: http://bikedeed.io (requires Chrome browser with Metamask plugin and a Mainnet Ethereum account with Ether).

Its inheriting contract `ERC721Deed.sol` is based on the `ERC721Token` from OpenZeppelin (https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Token.sol).

*Warning:* The standard is still open for discussion, so this project should be considered work in progress. Follow the discussion here: https://github.com/ethereum/EIPs/pull/841

## About this example

BikeDeed is a first attempt at building an Ethereum Dapp.  BikeDeed leans heavily on the incredible efforts of:
1. https://github.com/nastassiasachs/ERC721ExampleDeed
2. https://github.com/Michael-Free/bikechain-ethwaterloo.
3. OpenZeppelin.  

Thank you!  

## Prerequisites
1. npm
2. Truffle
3. Git
4. Ganache
5. Chrome browser with Metamask plugin

## Dev Installation
1. git clone https://github.com/kennethhoytwoodruff/BikeDeed.git
2. npm install
3. truffle compile
4. npm run test (optional)
5. start ganache on http://localhost:8545
6. truffle migrate
7. truffle exec scripts/populatebikedeed.js
8. truffle exec scripts/displaybikes.js (optional)
9. npm run build
10. npm run server
11. Make sure you have an Internet connection and go to http://localhost:8080 with your browser.

# Configure and start IPFS
1. ipfs init
2. ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
3. ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
4. ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
5. ipfs daemon

## Tests and mocks

The tests and mocks of this repository are based on OpenZeppelin work. The directory structure is a result of the decision to install their contracts through EthPM instead of NPM.  To perform unit tests type 'truffle exec tests/test.sh'.

## TODO
1. Add Approval functionality.
2. Update Proof of Ownership of existing Bike deeds - experiment with complex IPFS objects.
3. Refactor Javascript and Vue js.
4. Redesign UI for Android/IPhone compatibility.
5. Remove unused Node modules.
6. Improve Registration workflow.
7. Make BikeDeed use 'Composables' (ERC-998).
