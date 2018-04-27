require("babel-register");
require("babel-polyfill");
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "upset quantum soccer destroy buffalo alter flush exhaust wait rescue pioneer clip";
// var infura_apikey = "<key>";
// var mnemonic = "<bla bla bla>";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "4447",
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/uHJFDlXprJ52gu4uK9oA")
      },
      network_id: 3,
      gas: 4712388  
    }
  }
};
