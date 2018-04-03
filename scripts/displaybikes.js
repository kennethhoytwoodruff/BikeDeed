module.exports = function(callback) {

var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contract = require('truffle-contract');
var BikeDeed = contract(require('../build/contracts/BikeDeed.json'));

var _creator = "0xaE6D99dc7250EdE8711B7a8F9C9C2d7e53d88124";
//var _creator = "0xBb34A5f2205975e691991A7868744bD344186a7d";

BikeDeed.setProvider(provider);
BikeDeed.defaults({from: _creator, gas: 900000 });

const displayBikes = async () => {
  let deed = await BikeDeed.deployed();
  let deedIds = await deed.ids();

  const FIELD_NAME  = 0
  const FIELD_SERIAL_NUMBER = 1
  const FIELD_MANUFACTURER = 2
  const FIELD_CUSTODIAN = 3
  const FIELD_PRICE = 4
  const FIELD_DATE_CREATED = 5
  const FIELD_DATE_DELETED = 6

  let bikeStructs = []
  for (let i = 0; i < deedIds.length; i++) {
    var deedId = deedIds[i];
    var bikeDeed = await deed.deeds(deedId);
    const bike = {
        name:  web3.toAscii(bikeDeed[FIELD_NAME]),
        serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
        manufacturer: web3.toAscii(bikeDeed[FIELD_MANUFACTURER]),
        custodian: bikeDeed[FIELD_CUSTODIAN],
        price: bikeDeed[FIELD_PRICE],
        dateCreated: bikeDeed[FIELD_DATE_CREATED],
        dateDeleted: bikeDeed[FIELD_DATE_DELETED]
    }
    bikeStructs.push(bike)
  }

  console.log('bikeStructs =', bikeStructs)

}

displayBikes();

}
