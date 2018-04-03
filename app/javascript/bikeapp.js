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
      self.refreshPage();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshPage: function () {
    const loadPage = async () => {
      var self = this;
      var meta;
      let deed = await BikeDeed.deployed();
      let name = await deed.name();
      var addressTag = document.getElementById("myaddress");
      addressTag.innerHTML = account;
      var nameTag = document.getElementById("nametag");
      nameTag.innerHTML = name;
      self.displayBody();
    }
    loadPage();
  },

  displayBody: function() {
    const listBikes = async () => {
    BikeDeed.setProvider(web3.currentProvider);
      let deed = await BikeDeed.deployed();
      let deedIds = await deed.ids();

      // later only show bikes owned by user.
      //let deedIds = await deed.deedsOf(account);

      const FIELD_NAME  = 0
      const FIELD_SERIAL_NUMBER = 1
      const FIELD_MANUFACTURER = 2
      const FIELD_CUSTODIAN = 3
      const FIELD_PRICE = 4
      const FIELD_DATE_CREATED = 5
      const FIELD_DATE_DELETED = 6

      for (let i = 0; i < deedIds.length; i++) {
        var deedId = deedIds[i];
        var bikeDeed = await deed.deeds(deedId);
        var owner = await deed.ownerOf(deedId);
        const bike = {
            name:  web3.toAscii(bikeDeed[FIELD_NAME]),
            serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
            manufacturer: web3.toAscii(bikeDeed[FIELD_MANUFACTURER]),
            custodian: bikeDeed[FIELD_CUSTODIAN],
            price: bikeDeed[FIELD_PRICE],
            dateCreated: bikeDeed[FIELD_DATE_CREATED],
            dateDeleted: bikeDeed[FIELD_DATE_DELETED]
        }

        var newDiv = document.createElement("div");
        var bikeDescription = bike.serialNumber + " " + bike.manufacturer;
        //var bikeInfo = document.createTextNode(bike.serialNumber + " " + bike.manufacturer);
        var bikeInfo = bike.serialNumber + " " + bike.manufacturer;
        var link = document.createElement('a');
        link.setAttribute('href', '');
        link.setAttribute('width', '600');
        link.setAttribute('height', '400');
        link.setAttribute('onmouseover', "showBikeDetails(" + deedId + ")");
        link.innerHTML = bikeInfo;
        //document.body.appendChild(link);
        newDiv.appendChild(link);
        document.getElementById("bikelist").appendChild(newDiv);
        bikeStructs.push(bike)
      }
    }
    listBikes();
  },

  displayDetails: function(deedId) {
    const showDetails = async (deedId) => {
      BikeDeed.setProvider(web3.currentProvider);
      let deed = await BikeDeed.deployed();
      //let deedIds = await deed.ids();

        //let deedIds = await deed.deedsOf(account);
        //var deedId = 0;

      const FIELD_NAME  = 0
      const FIELD_SERIAL_NUMBER = 1
      const FIELD_MANUFACTURER = 2
      const FIELD_CUSTODIAN = 3
      const FIELD_PRICE = 4
      const FIELD_DATE_CREATED = 5
      const FIELD_DATE_DELETED = 6

      var bikeDeed = await deed.deeds(deedId);
      var owner = await deed.ownerOf(deedId);
      const bike = {
        name:  web3.toAscii(bikeDeed[FIELD_NAME]),
        serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
        manufacturer: web3.toAscii(bikeDeed[FIELD_MANUFACTURER]),
        custodian: bikeDeed[FIELD_CUSTODIAN],
        price: bikeDeed[FIELD_PRICE],
        dateCreated: bikeDeed[FIELD_DATE_CREATED],
        dateDeleted: bikeDeed[FIELD_DATE_DELETED]
      }

      document.getElementById("bikedetails").innerHTML = "";

      var serialNumber = document.createElement("div");
      serialNumber.appendChild(document.createTextNode("SerialNumber - " + bike.serialNumber));
      //document.getElementById("serialNumber").appendChild(serialNumber);
      document.getElementById("bikedetails").appendChild(serialNumber);

      var manufacturer = document.createElement("div");
      manufacturer.appendChild(document.createTextNode("Manufacturer - " + bike.manufacturer));
      //document.getElementById("manufacturer").appendChild(manufacturer);
      document.getElementById("bikedetails").appendChild(manufacturer);

      var custodian = document.createElement("div");
      custodian.appendChild(document.createTextNode("Owner - " + bike.custodian));
      //document.getElementById("custodian").appendChild(custodian);
      document.getElementById("bikedetails").appendChild(custodian);

      var custodian = document.createElement("div");
      custodian.appendChild(document.createTextNode("Custodian - " + bike.custodian));
      //document.getElementById("custodian").appendChild(custodian);
      document.getElementById("bikedetails").appendChild(custodian);

      var price = document.createElement("div");
      price.appendChild(document.createTextNode("Current Price - " + bike.price));
      //document.getElementById("price").appendChild(price);
      document.getElementById("bikedetails").appendChild(price);

      var dateCreated = document.createElement("div");
      dateCreated.appendChild(document.createTextNode("Date Registered - " + bike.dateCreated));
      //document.getElementById("dateCreated").appendChild(dateCreated);
      document.getElementById("bikedetails").appendChild(dateCreated);

        /*
        var dateDeleted = document.createElement("div");
        dateDeleted.appendChild(document.createTextNode(bike.dateDeleted));
        //document.getElementById("dateDeleted").appendChild(dateDeleted);
        document.getElementById("bikedetails").appendChild(dateDeleted);
        */

    }
    showDetails(deedId);
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
