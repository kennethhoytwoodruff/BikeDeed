// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

var BikeDeed = contract(require('../../build/contracts/BikeDeed.json'));

var accounts;
var account;
let bikeStructs = []

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the BikeDeed abstraction for Use.
    BikeDeed.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      //alert("using account: " + account);
      self.refreshPage();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshPage: function () {
    const loadPage = async () => {
      let deed = await BikeDeed.deployed();
      let name = await deed.name();
      var self = this;
      var nameTag = document.getElementById("nametag");
      nameTag.innerHTML = name;
      self.setStatus("Register a new bike deed on the blockchain.");
    }
    loadPage();
  },

  registerBike: function() {
    const regBike = async () => {
      var self = this;

      BikeDeed.setProvider(web3.currentProvider);
      BikeDeed.defaults({from: account, gas: 900000 });
      let deed = await BikeDeed.deployed();

      var manufacturer = document.getElementById("mfr").value;
      var serialnumber = document.getElementById("serial_number").value;
      var ipfsHash = document.getElementById("ipfs_hash").value;
      var purchasePrice = document.getElementById("purchase_price").value;
      var custodianAddress = document.getElementById("custodian_address").value;
      if (custodianAddress == "") {
        custodianAddress = account;
      }

      if (purchasePrice == "") {
        purchasePrice = "0";
      }

      self.setStatus("Registering bike deed on the blockchain. This may take a while...");

      try {
        alert("creating Bike deed");
        let result = await deed.create(serialnumber, manufacturer, ipfsHash, account, custodianAddress, purchasePrice);
      } catch (error) {
        console.log(error.message);
        self.setStatus(error.message);
        alert(error.message);
        return;
      }
      self.setStatus("New bike deed registered on the blockchain. Register another?<br/>");

      var link = document.createElement('a');
      link.setAttribute('href', 'index.html');
      link.innerHTML = "No thanks.";
      var status = document.getElementById("status");
      status.appendChild(link);

      document.getElementById("serial_number").value = "";
      document.getElementById("ipfs_hash").value = "";
      document.getElementById("purchase_price").value = "";
      document.getElementById("custodian_address").value = "";
      document.getElementById("mfr").value = "000";
    }
    regBike();
  }
};


window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 BikeDeeds, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});
