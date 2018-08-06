// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import Vue from './vue'
import bikemanufacturersfromfile from './bikemanufacturers.json'
import VModal from 'vue-js-modal'

Vue.use(VModal, { dynamic: true })
//import Modal from '../Modal.vue'

var BikeDeed = contract(require('../../build/contracts/BikeDeed.json'));
var Buffer = require('buffer/').Buffer;

// register modal component
Vue.component('modal', {
  template: '#modal-details-template',
  methods: {
    emit: function() {
			this.$emit('event_child', 1)
		}
  }
});

// register modal component
Vue.component('modal2', {
  template: '#modal-my-details-template',
  methods: {
    emit: function() {
			this.$emit('event_child', 1)
		}
  }
});

window.app = app;
var app = new Vue({
      el: '#app',
      data: {
        // Ropsten address???
        //contractAddress: '0x83f306d638daeedc8895ba5ae6dc6e173195e056',
        // Old Ropsten Address
        //contractAddress: '0xdeEe03988C64C3aa4fcFe36896c4272ACF490a33',
        // Mainnet
        contractAddress: '0xa7aB6FcA68f407BB5258556af221dE9d8D1A94B5',
        // Ganache Address???
        //contractAddress: '0x8fac4e98317322f8069307ccfbb64e8fdd9c180d',
        userAccount: '',
        nametag: '',
        status: '',
        message: '',
        allbikes: [],
        mybikes: [],
        bikelist: [],
        manufacturers: [],
        web3Enabled: false,
        networkLabel: '',
        // display controls
        search: '',
        showDetailsModal: false,
        showMyDetailsModal: false,
        bikeManufacturerSelected: false,
        pooFileLoaded: false,
        pooFileSelected: false,
        displayRegistrationComponents: true,
        showSpinner: false,
        showUploadSpinner: false,
        // specific bike details
        bikeOwner: '',
        bikeSerialNumber: '',
        bikeId: '',
        bikeManufacturer: '000', // default
        bikeIpfsHash: '',
        bikeDateCreated: '',
        bikeUrl: '',
        // miscellaneous
        newOwnerAddress: '',
        processingMessage: ''
      },
      beforeCreate: function () {
        console.log("beforeCreate...");
      },
      created: function () {
        console.log("created...");
      },
      beforeMount: function () {
        console.log("beforeMount...");
      },
      mounted:function(){
        console.log("mounted...");
        this.initWeb3();
        if (this.web3Enabled == true) {
          this.initAccounts();
          this.initContract();
          this.loadAllBikes();
          this.initManufacturers();
          //alert("performed mounted functions");
        }
      },
      beforeUpdate:function(){
        console.log("beforeUpdate...");
      },
      updated:function() {
        console.log("updated...");
      },
      activated:function() {
        console.log("activated...");
      },
      methods:{
        initWeb3:function(){
          // Checking if Web3 has been injected by the browser (Mist/MetaMask)
          let self = this;
          if (typeof web3 !== 'undefined') {
            console.warn("Using injected web3")
            // Use Mist/MetaMask's provider
            window.web3 = new Web3(web3.currentProvider);

            var networkId = web3.version.network;

            console.log('networkId: ' + networkId);

            switch (networkId) {
            case "1":
              this.networkLabel = "BikeDeed (Mainnet)";
              break;
            case "2":
              this.networkLabel = "You are on the Morden Network - Please switch to Mainnet";
              break;
            case "3":
              this.networkLabel = "You are on the Ropsten Network - Please switch to Mainnet";
              break;
            case "4":
              this.networkLabel = "You are on the Rinkeby Network - Please switch to Mainnet";
              break;
            case "42":
              this.networkLabel = "You are on the Kovan Network - Please switch to Mainnet";
              break;
            default:
              this.networkLabel = "BikeDeed";
            }
            this.web3Enabled = true;
          } else {
            console.warn("No web3 detected. .");
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            this.web3Enabled = false;
            this.networkLabel = "Ethereum is not enabled. Go to <a href=/bikes>read-only site.</a>";
            window.location = "https://bikedeed.io/bikes";
            //window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
          }
        },
        initAccounts:function(){
          let self = this;
          BikeDeed.setProvider(web3.currentProvider);
          this.userAccount = web3.eth.accounts[0];
        },
        initContract:function(){
          let self = this;
          const loadContract = async () => {
            let deed = await BikeDeed.at(this.contractAddress);
            let name = await deed.name();
            this.nametag = name;
          }
          loadContract();
        },
        loadAllBikes: function() {
          let self = this;
          this.allbikes.length=0;
          const loadBikes = async () => {
            let deed = await BikeDeed.at(this.contractAddress);
            let deedIds = await deed.ids();

            const FIELD_NAME  = 0
            const FIELD_SERIAL_NUMBER = 1
            const FIELD_MANUFACTURER = 2
            const FIELD_IPFS_HASH = 3
            const FIELD_DATE_CREATED = 4
            const FIELD_DATE_DELETED = 5

            for (let i = 0; i < deedIds.length; i++) {
              var deedId = deedIds[i];
              var bikeDeed = await deed.deeds(deedId);
              try {
                var bikeOwner = await deed.ownerOf(deedId);
              } catch(error) {
                // probably a deleted token and therefore has no owner.
                continue;
              }
              var url = await deed.deedUri(deedId);
              const bike = {
                id: deedId,
                name:  web3.toAscii(bikeDeed[FIELD_NAME]),
                serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
                manufacturer: web3.toAscii(bikeDeed[FIELD_MANUFACTURER]).replace(/\u0000/g, ''),
                ipfsHash: bikeDeed[FIELD_IPFS_HASH],
                dateCreated: bikeDeed[FIELD_DATE_CREATED],
                dateDeleted: bikeDeed[FIELD_DATE_DELETED],
                owner: bikeOwner,
                bikeUrl: url
             }
             if (web3.isAddress(bikeOwner)) {
               this.allbikes.push(bike);
             }
           }
        }
        loadBikes();
        this.bikelist = this.allbikes;
      },
      lookupManufacturerLabel: function (value1) {
        var i;
        for (i = 0; i < this.manufacturers.length; i++) {
          var value2 = this.manufacturers[i].value;
          if (value1.trim() == value2.trim()) {
            return this.manufacturers[i].text;
          }
        }
        return value1;
      },
      bikeLabel: function (bike) {
        var i;
        for (i = 0; i < this.manufacturers.length; i++) {
          var value1 = bike.manufacturer;
          var value2 = this.manufacturers[i].value;
          if (value1.trim() == value2.trim()) {
            return this.manufacturers[i].text;
          }
        }
        return value1;
      },
      initManufacturers: function() {
         this.manufacturers = bikemanufacturersfromfile;
      },
      showMyBikes:function() {
        this.initAccounts();
        this.allbikes.length = 0;
        for (let index = 0; index < this.allbikes.length; ++index) {
          let bike = this.allbikes[index];
          if (bike.owner == this.userAccount) {
            this.mybikes.push(bike);
          }
        }
        this.bikelist = this.mybikes;
      },
      showAllBikes:function() {
        this.mybikes.length = 0;
        this.bikelist = this.allbikes;
      },
      showBikeDetails:function(bike) {
       // Not sure why this has to be done.
        this.initAccounts();
        this.bikeId = bike.id;
        this.bikeOwner = bike.owner;
        this.bikeSerialNumber = bike.serialNumber;
        this.bikeManufacturer = bike.manufacturer;
        this.bikeIpfsHash = bike.ipfsHash;
        this.bikeDateCreated = new Date(bike.dateCreated*1000);
        this.bikeUrl = bike.bikeUrl;
        if (this.userAccount == bike.owner) {
          this.showMyDetailsModal=true;
          this.displayRegistrationComponents=true;
          this.processingMessage = "Transfer to Address:"
        }
        else {
          this.showDetailsModal=true;
        }
     },
     displayMetaData:function() {
       window.open(this.bikeUrl, "proofofownershipwindow", "location=yes,height=570,width=520,scrollbars=yes,status=yes");
     },
     confirmRegistration:function() {
       this.initAccounts();
       // HACK ALERT: prepend 'S' if serialNumber does not contain a letter.
       // this is due to a bug in the contract.
       var letter = /^[a-zA-Z]+$/;
       if (!this.bikeSerialNumber.match(letter))  {
         this.bikeSerialNumber = 'S' + this.bikeSerialNumber;
       }
       this.showDetailsModal = true;
     },
     deleteBikeDeed: function() {
       const destroyDeed = async () => {
         var self = this;
         BikeDeed.defaults({from: this.userAccount, gas: 900000 });
         let deed = await BikeDeed.at(this.contractAddress);
         this.processingMessage = "Deleting bike deed. This may take a while...";
         this.showSpinner=true;
         this.displayRegistrationComponents = false;
         this.sleep(1000);
         try {
           let result = await deed.destroy(this.bikeId);
         } catch (error) {
           console.log(error.message);
           this.processingMessage = error.message;
           alert(error.message);
           this.showSpinner=false;
           this.displayRegistrationComponents = true;
           return;
         }
         this.processingMessage = "Congratulations!  Your bike has been deleted!";
         this.bikeOwner = this.newOwnerAddress;
         this.showSpinner=false;
         this.displayRegistrationComponents = false;
         this.initAccounts();
         this.loadAllBikes();
       }

       // Not sure why this has to be done.
       this.initAccounts();

       if (!destroyDeed()) {
         return;
       }
     },
     transferOwnership: function() {
       const transfer = async () => {
         var self = this;
         BikeDeed.defaults({from: this.userAccount, gas: 900000 });
         let deed = await BikeDeed.at(this.contractAddress);
         this.displayRegistrationComponents=false;
         this.processingMessage = "Transferring bike deed to " + this.newOwnerAddress + ". This may take a while...";
         this.showSpinner = true;
         try {
           //alert("creating Bike deed with "  + this.bikeSerialNumber + " " +  this.bikeManufacturer + " " +  this.bikeIpfsHash + " " +  this.userAccount);
           let result = await deed.transfer(this.newOwnerAddress, this.bikeId);
         } catch (error) {
           console.log(error.message);
           this.processingMessage = error.message;
           alert(error.message);
           this.displayRegistrationComponents=true;
           this.showSpinner = false;
           return true;
         }
         this.processingMessage = "Congratulations!  Your bike has been transferred to " + this.newOwnerAddress + "!";
         this.showSpinner = false;
         this.bikeOwner = this.newOwnerAddress;
         return true;
       }

       // Not sure why this has to be done.
       this.initAccounts();

       if (!web3.isAddress(this.newOwnerAddress)) {
         var errorMsg = "Not a valid address!";
         console.log(errorMsg);
         this.processingMessage = errorMsg;
         return true;
       }

       if (!transfer()) {
         return true;
       }
     },
     registerBike: function() {
       this.showDetailsModal = false;
       //alert("registering bike")
       const registerBikeOnBlockchain = async () => {
         var self = this;
         BikeDeed.defaults({from: this.userAccount, gas: 900000 });
         let deed = await BikeDeed.at(this.contractAddress);
         this.status = "Registering bike deed on the blockchain. This may take a while...";
         this.showSpinner = true;
         try {
           //alert("creating Bike deed with "  + this.bikeSerialNumber + " " +  this.bikeManufacturer + " " +  this.bikeIpfsHash + " " +  this.userAccount);
           let result = await deed.create(this.bikeSerialNumber, this.bikeManufacturer, this.bikeIpfsHash, this.userAccount);
         } catch (error) {
           console.log(error.message);
           this.status = error.message;
           this.showSpinner = false;
           alert(error.message);
           return false;
         }
         this.status = "Congratulations!  Your bike has been registered on the blockchain.";
         this.showSpinner = false;
         this.clearRegistrationForm();
         return true;
       }

       // Not sure why this has to be done.
       this.initAccounts();


       if (!registerBikeOnBlockchain()) {
         return;
       }
     },
     displayPooExample:function() {
       window.open("poofileexample.jpg", "poofileexamplewindow", "titlebar=no,location=no,height=570,width=520,scrollbars=yes,status=no");
     },
     clearRegistrationForm:function() {
        this.pooFileSelected = false;
        this.bikeManufacturer = '000';
        this.bikeSerialNumber = '';
        this.bikeIpfsHash = '';
        this.showDetailsModal = false;
        this.bikeManufacturerSelected = false;
        this.pooFileLoaded = false;
     },
     pooFileSelectedEvent:function(event) {
        this.pooFileSelected = true;
        this.bikeIpfsHash = '';
     },
     uploadFileToIpfs:function () {
        var self = this;

       // since readAsArrayBuffer does not return a Promise, do this.
       const readUploadedFileAsBuffer = (inputFile) => {
         const reader = new FileReader();
         return new Promise((resolve, reject) => {
           reader.onerror = () => {
           reader.abort();
           reject(new DOMException("Problem parsing input file."));
         };
         reader.onload = () => {
           resolve(reader.result);
         };
         reader.readAsArrayBuffer(inputFile);
         });
       };

       const uploadFile = async () => {
         const pooFile = document.getElementById("pooFile");
         const reader = new FileReader();
         const fileContents = await readUploadedFileAsBuffer(pooFile.files[0]);
         const ipfs = window.IpfsApi('bikedeed.io', 443, {protocol:'https'} ); // Connect to IPFS
         const buf = Buffer.from(fileContents); // Convert data into buffer
         this.showUploadSpinner = true;
         ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
           var self = this;
           if(err) {
             alert(err);
             console.error(err);
             this.showUploadSpinner = false;
             return;
           }
           this.bikeIpfsHash = result[0].hash;
           this.bikeUrl = "https://ipfs.io/ipfs/" + this.bikeIpfsHash;
           this.showUploadSpinner = false;
           this.pooFileLoaded = true;
        });
      }
      this.showUploadSpinner = true;
      uploadFile();
    },
    sleep:function(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    }
  },
  computed: {
    filteredBikes: function() {
      return this.bikelist.filter((bike) => {
        var searchString = this.search.toLowerCase();
        var label = this.bikeLabel(bike).toLowerCase();
        return (label.match(searchString) || bike.serialNumber.toLowerCase().match(searchString));
      });
    }
  }
})
