// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import Vue from './vue'
import bikemanufacturersfromfile from './bikemanufacturers.json'

var BikeDeed = contract(require('../../build/contracts/BikeDeed.json'));

window.app = app;
var app = new Vue({
      el: '#app',
      data: {
        // Ropsten address
        contractAddress: '0xdeEe03988C64C3aa4fcFe36896c4272ACF490a33',
        userAccount: '',
        nametag: '',
        status: '',
        message: '',
        allbikes: [],
        mybikes: [],
        bikelist: [],
        manufacturers: [],
        // display controls
        displayDetails: false,
        // specific bike details
        bikeOwner: '',
        bikeSerialNumber: '',
        bikeManufacturer: '',
        bikeIpfsHash: '',
        bikeDateCreated: '',
        bikeMetaData: ''
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
        alert("performed mounted functions");
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
              var bikeMetaData = await deed.deedUri(deedId);
              const bike = {
                name:  web3.toAscii(bikeDeed[FIELD_NAME]),
                serialNumber: web3.toAscii(bikeDeed[FIELD_SERIAL_NUMBER]),
                manufacturer: web3.toAscii(bikeDeed[FIELD_MANUFACTURER]),
                ipfsHash: bikeDeed[FIELD_IPFS_HASH],
                dateCreated: bikeDeed[FIELD_DATE_CREATED],
                dateDeleted: bikeDeed[FIELD_DATE_DELETED],
                owner: bikeOwner,
                metaData: bikeMetaData
             }
             this.allbikes.push(bike);
           }
        }
        loadBikes();
        this.bikelist = this.allbikes;
        this.displayDetails = false;
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
        this.displayDetails = false;
      },
      showAllBikes:function() {
        this.mybikes.length = 0;
        this.bikelist = this.allbikes;
        this.displayDetails = false;
      },
      showBikeDetails:function(bike) {
        this.bikeOwner = bike.owner;
        this.bikeSerialNumber = bike.serialNumber;
        this.bikeManufacturer = bike.manufacturer;
        this.bikeIpfsHash = bike.ipfsHash;
        this.bikeDateCreated = new Date(bike.dateCreated*1000);
        this.bikeMetaData = bike.metaData;
        this.displayDetails = true;
     },
     displayMetaData:function() {
       window.open(this.bikeMetaData, "_blank", "location=yes,height=570,width=520,scrollbars=yes,status=yes");
     },
     registerBike: function() {
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
         return true;
       }

       // Not sure why this has to be done.
       this.initAccounts();

       // TODO: form validation prior to registration
       if (!registerBikeOnBlockchain()) {
         return;
       }
     }
   }
})
