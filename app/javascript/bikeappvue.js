// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import Vue from './vue'
import bikemanufacturersfromfile from './bikemanufacturers.json'
import VModal from 'vue-js-modal'

Vue.use(VModal, { dynamic: true })
//import Modal from '../Modal.vue'

var BikeDeed = contract(require('../../build/contracts/BikeDeed.json'));

// register modal component
Vue.component('modal', {
  template: '#modal-details-template',
  methods: {
    emit: function() {
			this.$emit('event_child', 1)
		}
  }
})

window.app = app;
var app = new Vue({
      el: '#app',
      data: {
        // Ropsten address
        //contractAddress: '0xdeEe03988C64C3aa4fcFe36896c4272ACF490a33',
        contractAddress: '0x8fac4e98317322f8069307ccfbb64e8fdd9c180d',
        //contractAddress: '0x7d9e9c47c81c0d700b46e5da16183ac0a15517f7',
        userAccount: '',
        nametag: '',
        status: '',
        message: '',
        allbikes: [],
        mybikes: [],
        bikelist: [],
        manufacturers: [],
        // display controls
        showDetailsModal: false,
        bikeManufacturerSelected: false,
        pooFileLoaded: false,
        pooFileSelected: false,
        // specific bike details
        bikeOwner: '',
        bikeSerialNumber: '',
        bikeManufacturer: '000', // default
        bikeIpfsHash: '',
        bikeDateCreated: '',
        bikeUrl: ''
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
        this.initAccounts();
        this.initContract();
        this.loadAllBikes();
        this.initManufacturers();
        //alert("performed mounted functions");
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
            //console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 BikeDeeds, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
            console.warn("Using injected web3")
            // Use Mist/MetaMask's provider
            window.web3 = new Web3(web3.currentProvider);
          } else {
            console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
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
              var bikeOwner = await deed.ownerOf(deedId);
              var url = await deed.deedUri(deedId);
              const bike = {
                name:  web3.toAscii(bikeDeed[FIELD_NAME]),
                serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
                manufacturer: web3.toAscii(bikeDeed[FIELD_MANUFACTURER]).replace(/\u0000/g, ''),
                ipfsHash: bikeDeed[FIELD_IPFS_HASH],
                dateCreated: bikeDeed[FIELD_DATE_CREATED],
                dateDeleted: bikeDeed[FIELD_DATE_DELETED],
                owner: bikeOwner,
                bikeUrl: url
             }
             this.allbikes.push(bike);
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
        this.bikeOwner = bike.owner;
        this.bikeSerialNumber = bike.serialNumber;
        this.bikeManufacturer = bike.manufacturer;
        this.bikeIpfsHash = bike.ipfsHash;
        this.bikeDateCreated = new Date(bike.dateCreated*1000);
        this.bikeUrl = bike.bikeUrl;
        this.showDetailsModal=true;
     },
     displayMetaData:function() {
       window.open(this.bikeUrl, "proofofownershipwindow", "location=yes,height=570,width=520,scrollbars=yes,status=yes");
     },
     confirmRegistration:function() {
       this.initAccounts();
       this.showDetailsModal = true;
     },
     registerBike: function() {
       this.showDetailsModal = false;
       //alert("registering bike")
       const registerBikeOnBlockchain = async () => {
         var self = this;
         BikeDeed.defaults({from: this.userAccount, gas: 900000 });
         let deed = await BikeDeed.at(this.contractAddress);
         this.status = "Registering bike deed on the blockchain. This may take a while...";
         try {
           //alert("creating Bike deed with "  + this.bikeSerialNumber + " " +  this.bikeManufacturer + " " +  this.bikeIpfsHash + " " +  this.userAccount);
           let result = await deed.create(this.bikeSerialNumber, this.bikeManufacturer, this.bikeIpfsHash, this.userAccount);
         } catch (error) {
           console.log(error.message);
           this.status = error.message;
           alert(error.message);
           return false;
         }
         this.status = "Congratulations!  Your bike has been registered on the blockchain.";
         this.clearRegistrationForm();
         return true;
       }

       // Not sure why this has to be done.
       this.initAccounts();

       // TODO: form validation prior to registration
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
         const ipfs = window.IpfsApi('bikedeed.io', 5001) // Connect to IPFS
         const buf = buffer.Buffer(fileContents) // Convert data into buffer
         ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
           var self = this;
           if(err) {
             alert(err);
             console.error(err);
             return;
           }
           this.bikeIpfsHash = result[0].hash;
           this.bikeUrl = "https://ipfs.io/ipfs/" + this.bikeIpfsHash;
        });
      }
      uploadFile();
      this.pooFileLoaded = true;
    }
  }
})
