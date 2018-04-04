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

const _manufacturer1 = "Specialized";
const _manufacturer2 = "Moots";
const _manufacturer3 = "Santa Cruz";
const _manufacturer4 = "Giant";
const _manufacturer5 = "Schwinn";
const _manufacturer6 = "Bianchi";
const _manufacturer7 = "Scott";

const _serialNumber1 = "SBC973528365";
const _serialNumber2 = "M1024";
const _serialNumber3 = "LTS7300927";
const _serialNumber4 = "R76HGTEUR7";
const _serialNumber5 = "VGHR8987IHKH";
const _serialNumber6 = "98UYDGE";
const _serialNumber7 = "63U00927";

BikeDeed.setProvider(provider);
BikeDeed.defaults({from: _creator, gas: 900000 });

const populateDeeds = async () => {
  let deed = await BikeDeed.deployed();
  let name = await deed.name();

  try {
    await deed.create(_serialNumber1, _manufacturer1, _owner1, _bikeShop1);
    await deed.create(_serialNumber2, _manufacturer2, _owner2, _bikeShop1);
    await deed.create(_serialNumber3, _manufacturer3, _owner3, _bikeShop1);
    await deed.create(_serialNumber4, _manufacturer4, _owner4, _bikeShop1);
    await deed.create(_serialNumber5, _manufacturer5, _owner5, _bikeShop2);
    await deed.create(_serialNumber6, _manufacturer6, _owner6, _bikeShop2);
    await deed.create(_serialNumber7, _manufacturer7, _owner7, _bikeShop2);
    // Optionally add your bike(s) here.
    await deed.create("My$3r1AlnuM53R", "Specialized", "0x28b54fa6fbd87ce560484deb6d750d2fff243552", _bikeShop1);
    await deed.create("MyS3r1AlnuM53R2", "Firenze", "0x28b54fa6fbd87ce560484deb6d750d2fff243552", _bikeShop1);
	  
	  
  } catch (error) {
    console.log(error.message);
  }
}

populateDeeds();

}
