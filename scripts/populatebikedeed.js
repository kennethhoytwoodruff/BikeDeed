module.exports = function(callback) {

var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require('truffle-contract');
var BikeDeed = contract(require('../build/contracts/BikeDeed.json'));
const _unknownDeedId = 999;

// get this from ganache
const _creator = "0xaE6D99dc7250EdE8711B7a8F9C9C2d7e53d88124";

const _firstOwner =
    "0xcFBD509C4F37437190BF7EB1F9767c1282d5938E";
    //"0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501202";
const _secondOwner =
    "0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501203";
const _thirdOwner =
    "0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501204";
const _unrelatedAddr =
    "0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501201";
const _bikeShop =
    "0x35D5692ACE1a72a26849Cc088e5Ce96d34C054C8";
    //"0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501205";
const _manufacturer1 = "Specialized";
const _manufacturer2 = "Moots";
const _manufacturer3 = "Santa Cruz";
const _serialNumber1 = "WSBC973528365";
const _serialNumber2 = "M1024";
const _serialNumber3 = "LTS7300927";
const _deletedSerialNumber = "LTS4530957";

BikeDeed.setProvider(provider);
BikeDeed.defaults({from: _creator, gas: 900000 });

const populateDeeds = async () => {
  let deed = await BikeDeed.deployed();
  let name = await deed.name();
  console.log(name);

  try {
    await deed.create(_serialNumber1, _manufacturer1, _firstOwner, _bikeShop);
    await deed.create(_serialNumber2, _manufacturer2, _secondOwner, _bikeShop);
    await deed.create(_serialNumber3, _manufacturer3, _secondOwner, _bikeShop);
    await deed.create(_deletedSerialNumber, _manufacturer3, _creator, _bikeShop);
  } catch (error) {
    console.log(error.message);
  }
}

populateDeeds();

}
