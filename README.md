#BikeDeed

`BikeDeed.sol` is an attempt to implement the latest draft of the ERC721 standard. 

Its inheriting contract `ERC721Deed.sol` is based on the `ERC721Token` from OpenZeppelin (https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Token.sol). 

*Warning:* The standard is still open for discussion, so this project should be considered work in progress. Follow the discussion here: https://github.com/ethereum/EIPs/pull/841

## About this example

BikeDeed relies heavily on the incredible efforts of https://github.com/nastassiasachs/ERC721ExampleDeed, https://github.com/Michael-Free/bikechain-ethwaterloo and OpenZeppelin.  Thank you!

## Prerequisites
1. npm
2. Truffle
3. Git
4. Ganache
5. A browser with the Metamask plugin

## Dev Installation
1. git clone https://github.com/kennethhoytwoodruff/BikeDeed.git
2. npm install
3. truffle compile
4. npm run test (optional)
5. start ganache on http://localhost:8545 
6. truffle migrate
7. truffle exec scripts/populatebikedeed.sh
8. truffle exec scripts/displaybikes.sh (optional)
9. npm run build
10. npm run server
11. hit http://localhost:8455 with your browser.

## Tests and mocks

The tests and mocks of this repository are based on OpenZeppelin work. The directory structure is a result of the decision to install their contracts through EthPM instead of NPM.  To perform unit tests type 'truffle exec tests/test/sh'.

## TODO
1. Searching
2. Graphics
3. Remove unused node modules.



