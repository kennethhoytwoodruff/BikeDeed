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
      var self = this;
      var meta;
      let deed = await BikeDeed.deployed();
      let name = await deed.name();

      var newDiv = document.createElement("div");
      var link = document.createElement('a');
      link.setAttribute('href', '');
      link.setAttribute('width', '600');
      link.setAttribute('height', '400');
      link.setAttribute('onmouseover', "showAllBikes()");
      //link.setAttribute('onclick', "showMyBikes(" + account + ")");
      //link.innerHTML = account;
      link.innerHTML = "All Bikes";
      newDiv.appendChild(link);
      var addressTag = document.getElementById("mybikes").appendChild(newDiv);

      var newDiv2 = document.createElement("div");
      var link2 = document.createElement('a');
      link2.setAttribute('href', '');
      link2.setAttribute('width', '600');
      link2.setAttribute('height', '400');
      link2.setAttribute('onmouseover', "showMyBikes()");
      //link.setAttribute('onclick', "showMyBikes(" + account + ")");
      //link.innerHTML = account;
      link2.innerHTML = "My Bikes";
      newDiv2.appendChild(link2);
      var addressTag = document.getElementById("allbikes").appendChild(newDiv2);

      var nameTag = document.getElementById("nametag");
      nameTag.innerHTML = name;
      self.showAllBikes();
    }
    loadPage();
  },

  showMyBikes: function() {
    const listMyBikes = async () => {
      document.getElementById("bikedetails").innerHTML = "";
      BikeDeed.setProvider(web3.currentProvider);
      let deed = await BikeDeed.deployed();
      let deedIds = await deed.deedsOf(account);

      const FIELD_NAME  = 0
      const FIELD_SERIAL_NUMBER = 1
      const FIELD_MANUFACTURER = 2
      const FIELD_IPFS_HASH = 3
      const FIELD_CUSTODIAN = 4
      const FIELD_PRICE = 5
      const FIELD_DATE_CREATED = 6
      const FIELD_DATE_DELETED = 7

      document.getElementById("bikelist").innerHTML="";
      for (let i = 0; i < deedIds.length; i++) {
        var deedId = deedIds[i];
        var bikeDeed = await deed.deeds(deedId);
        var owner = await deed.ownerOf(deedId);
        const bike = {
            name:  web3.toAscii(bikeDeed[FIELD_NAME]),
            serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
            manufacturer: web3.toAscii(bikeDeed[FIELD_MANUFACTURER]),
            ipfsHash: bikeDeed[FIELD_IPFS_HASH],
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
        //link.setAttribute('onmouseout', "clearBikeDetails()");
        link.innerHTML = bikeInfo;
        document.body.appendChild(link);
        newDiv.appendChild(link);
        document.getElementById("bikelist").appendChild(newDiv);
      }
    }
    listMyBikes();
  },

  showAllBikes: function() {
    const showAllBikes = async () => {
    document.getElementById("bikedetails").innerHTML = "";
    BikeDeed.setProvider(web3.currentProvider);
      let deed = await BikeDeed.deployed();
      let deedIds = await deed.ids();

      const FIELD_NAME  = 0
      const FIELD_SERIAL_NUMBER = 1
      const FIELD_MANUFACTURER = 2
      const FIELD_IPFS_HASH = 3
      const FIELD_CUSTODIAN = 4
      const FIELD_PRICE = 5
      const FIELD_DATE_CREATED = 6
      const FIELD_DATE_DELETED = 7

      document.getElementById("bikelist").innerHTML="";
      for (let i = 0; i < deedIds.length; i++) {
        var deedId = deedIds[i];
        var bikeDeed = await deed.deeds(deedId);
        var owner = await deed.ownerOf(deedId);
        const bike = {
            name:  web3.toAscii(bikeDeed[FIELD_NAME]),
            serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
            manufacturer: web3.toAscii(bikeDeed[FIELD_MANUFACTURER]),
            ipfsHash: bikeDeed[FIELD_IPFS_HASH],
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
        //link.setAttribute('onmouseout', "clearBikeDetails()");
        link.innerHTML = bikeInfo;
        document.body.appendChild(link);
        newDiv.appendChild(link);
        document.getElementById("bikelist").appendChild(newDiv);
        bikeStructs.push(bike)
      }
    }
    showAllBikes();
  },

  displayDetails: function(deedId) {
    const showDetails = async (deedId) => {
      BikeDeed.setProvider(web3.currentProvider);
      let deed = await BikeDeed.deployed();

      const FIELD_NAME  = 0
      const FIELD_SERIAL_NUMBER = 1
      const FIELD_MANUFACTURER = 2
      const FIELD_IPFS_HASH = 3
      const FIELD_CUSTODIAN = 4
      const FIELD_PRICE = 5
      const FIELD_DATE_CREATED = 6
      const FIELD_DATE_DELETED = 7

      var bikeDeed = await deed.deeds(deedId);
      var bikeOwner = await deed.ownerOf(deedId);
      var bikeMetaData = await deed.deedUri(deedId);
      const bike = {
        name:  web3.toAscii(bikeDeed[FIELD_NAME]),
        serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
        manufacturer: web3.toAscii(bikeDeed[FIELD_MANUFACTURER]),
        ipfsHash: bikeDeed[FIELD_IPFS_HASH],
        custodian: bikeDeed[FIELD_CUSTODIAN],
        price: bikeDeed[FIELD_PRICE],
        dateCreated: bikeDeed[FIELD_DATE_CREATED],
        dateDeleted: bikeDeed[FIELD_DATE_DELETED]
      }

      document.getElementById("bikedetails").innerHTML = "";
      var metaData = document.createElement("div");
      var link = document.createElement('a');
      link.setAttribute('href', '');
      link.setAttribute('onclick',  "window.open('" + bikeMetaData + "', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'); return false;");
      link.setAttribute('width', '600');
      link.setAttribute('height', '400');
      link.innerHTML = "IPFS Link";
      metaData.appendChild(link);
      document.getElementById("bikedetails").appendChild(metaData);

      var serialNumber = document.createElement("div");
      serialNumber.appendChild(document.createTextNode("Serial Number - " + bike.serialNumber));
      document.getElementById("bikedetails").appendChild(serialNumber);

      var manufacturer = document.createElement("div");
      manufacturer.appendChild(document.createTextNode("Manufacturer Code - " + bike.manufacturer));
      document.getElementById("bikedetails").appendChild(manufacturer);

      var owner = document.createElement("div");
      owner.appendChild(document.createTextNode("Owner Ethereum Address - " + bikeOwner));
      document.getElementById("bikedetails").appendChild(owner);

      var custodian = document.createElement("div");
      custodian.appendChild(document.createTextNode("Bike Shop Ethereum Address - " + bike.custodian));
      document.getElementById("bikedetails").appendChild(custodian);

      var price = document.createElement("div");
      price.appendChild(document.createTextNode("Purchase Price (Wei) - " + bike.price));
      document.getElementById("bikedetails").appendChild(price);

      var dateCreated = document.createElement("div");
      dateCreated.appendChild(document.createTextNode("Date Registered - " + new Date(bike.dateCreated*1000)));
      document.getElementById("bikedetails").appendChild(dateCreated);

    }
    showDetails(deedId);
  },

  clearDetails: function() {
    const clear = async () => {
      document.getElementById("bikedetails").innerHTML = "";
    }
    clear();
  }
};

  function popup(){
    var popup = document.createElement('div');
    popup.className = 'popup';
    popup.id = 'test';
    var cancel = document.createElement('div');
    cancel.className = 'cancel';
    cancel.innerHTML = 'close';
    cancel.onclick = function (e) { popup.parentNode.removeChild(popup) };
    var message = document.createElement('span');
    message.innerHTML = "This is a test message";
    popup.appendChild(message);
    popup.appendChild(cancel);
    document.body.appendChild(popup);
}

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
