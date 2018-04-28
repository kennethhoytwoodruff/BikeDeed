module.exports = function(callback) {

var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require('truffle-contract');
var BikeDeed = contract(require('../build/contracts/BikeDeed.json'));
var web3 = new Web3(provider);

const _creator = web3.eth.accounts[0];
const _owner1 = web3.eth.accounts[1];
const _owner2 = web3.eth.accounts[2];
const _owner3 = web3.eth.accounts[3];
const _owner4 = web3.eth.accounts[4];
const _owner5 = web3.eth.accounts[5];
const _owner6 = web3.eth.accounts[6];
const _owner7 = web3.eth.accounts[7];
const _bikeShop1 = web3.eth.accounts[8];
const _bikeShop2 = web3.eth.accounts[9];

const _ipfs1 = "QmapmkuG84mVjWbLgoPWfZpJvFR1d6tQ8B8u1NnNAnb9vz";
const _ipfs2 = "QmTsx8byxDXaZV5pcNsaoctctibJqm5H3jmZ6XeSgH2RRD";
const _ipfs3 = "QmPB7wCgU35yt2uJ1ynsEYM9jQxLnYDAPEjpZoVWCV7yqj";
const _ipfs4 = "QmcY3N16r4GSNkgJPJiQjKxYVTrB27yzqPAgVonqVpMq5r";
const _ipfs5 = "QmeJ7qTAuViHztHs1RqGHvAgRtnJwQfEu1Kjt5hWbPJVfj";
const _ipfs6 = "QmT8CqNEbpv11hFQxjYzEzd4qRk5nCGhNTkoVeVSmz9UdW";
const _ipfs7 = "QmaoRCweKNLfdnv8sQz9v9fyZ3AsPCT9m2PBdWSWtHkzhM ";
const _ipfs8 = "QmRgCm6EBtqSeCNKboZYH7NhncdpD7nKheYJR8NDX8rCqw";

const _manufacturer1 = "S25"; //"Specialized";
const _manufacturer2 = "M20"; //"Moots Cycles";
const _manufacturer3 = "S02"; //"Santa Cruz Bikes";
const _manufacturer4 = "G06"; //"Giant Manufacturing";
const _manufacturer5 = "S06"; //"Schwinn Bicycle Company";
const _manufacturer6 = "B08"; //"Bianchi";
const _manufacturer7 = "B16"; //"Bohemian Bicycles"

const _serialNumber1 = "SBC973528365";
const _serialNumber2 = "M1024";
const _serialNumber3 = "LTS7300927";
const _serialNumber4 = "R76HGTEUR7";
const _serialNumber5 = "VGHR8987IHKH";
const _serialNumber6 = "98UYDGE";
const _serialNumber7 = "63U00927";

const _price1 = 1.0;
const _price2 = .001;
const _price3 = .02;
const _price4 = 10.0;
const _price5 = 1.01;
const _price6 = 1.002;


BikeDeed.setProvider(provider);
BikeDeed.defaults({from: _creator, gas: 900000 });

const populateDeeds = async () => {
  let deed = await BikeDeed.deployed();
  let name = await deed.name();

  try {
    // These will appear when you click the "All Bikes" link or when the index.html first loads.
    await deed.create(_serialNumber1, _manufacturer1, _ipfs1, _owner1, _bikeShop1, _price1);
    await deed.create(_serialNumber2, _manufacturer2, _ipfs2, _owner2, _bikeShop1, _price2);
    await deed.create(_serialNumber3, _manufacturer3, _ipfs3, _owner3, _bikeShop1, _price3);
    await deed.create(_serialNumber4, _manufacturer4, _ipfs4, _owner4, _bikeShop1, _price4);
    await deed.create(_serialNumber5, _manufacturer5, _ipfs5, _owner5, _bikeShop2, _price5);
    await deed.create(_serialNumber6, _manufacturer6, _ipfs6, _owner6, _bikeShop2, _price6);
    await deed.create(_serialNumber7, _manufacturer7, _ipfs7, _owner7, _bikeShop2, 0);
    // Optionally add your PERSONAL bike(s) here, so the "My Bikes" link will work.
    await deed.create("My$3r1AlnuM53R", "S25", _ipfs8, "0x28b54fa6fbd87ce560484deb6d750d2fff243552", _bikeShop1, _price1);
    await deed.create("MyS3r1AlnuM53R2", "F05", _ipfs1, "0x28b54fa6fbd87ce560484deb6d750d2fff243552", _bikeShop1, _price2);


  } catch (error) {
    console.log(error.message);
  }
}

populateDeeds();

}
