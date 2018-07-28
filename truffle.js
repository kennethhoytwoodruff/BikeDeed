require("babel-register");
require("babel-polyfill");
var HDWalletProvider = require("truffle-hdwallet-provider");
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
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/uHJFDlXprJ52gu4uK9oA")
      },
      network_id: 1,
      gasPrice: 1100000000,
      gas: 4712388
    }
  }
};
