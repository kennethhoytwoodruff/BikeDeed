#BikeDeed

`BikeDeed.sol` is an attempt to implement the latest draft of the ERC721 standard. 

Its inheriting contract `ERC721Deed.sol` is based on the `ERC721Token` from OpenZeppelin (https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/ERC721/ERC721Token.sol). 

*Warning:* The standard is still open for discussion, so this project should be considered work in progress. Follow the discussion here: https://github.com/ethereum/EIPs/pull/841

## About this example

BikeDeed relies heavily on the incredible efforts of https://github.com/nastassiasachs/ERC721ExampleDeed, https://github.com/Michael-Free/bikechain-ethwaterloo and OpenZeppelin.  Thank you!

## Installation
1. git clone https://github.com/kennethhoytwoodruff/BikeDeed.git
2. npm init
3. truffle compile
4. truffle migrate
5. npm run build
6. npm run server

## Tests and mocks

The tests and mocks of this repository are based on OpenZeppelin work. The directory structure is a result of the decision to install their contracts through EthPM instead of NPM.  To perform unit tests type 'truffle exec tests/test/sh'.

## TODO
1. Searching
2. Graphics



