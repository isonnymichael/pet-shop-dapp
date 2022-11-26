App = {
    web3Provider: null,
    contracts: {},
    account: '',
  
    init: async function() {
  
      return await App.initWeb3();
    },
  
    initWeb3: async function() {
      // modern dapp browsers
      if(window.ethereum){
        App.web3Provider = window.ethereum;
        try{
          // request account access
          await window.ethereum.enable();
        }catch(error){
          // user denied account access
          console.log("user denied account access");
        }
      }
      // legacy dapp browsers
      else if (window.web3){
        App.web3Provider = window.web3.currentProvider;
      }
      // if no injected web3 instance detected, fall back to ganache
      else{
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7475');
      }
      web3 = new Web3(App.web3Provider);
  
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON('Adoption.json', function(data){
        var AdoptionArtifact = data;
        App.contracts.Adoption = TruffleContract(AdoptionArtifact);
  
        App.contracts.Adoption.setProvider(App.web3Provider);
  
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }

          App.account = accounts[0];

        });

        return App.myAdopted();
      });
  
    },
  
    myAdopted: function() {
      var adoptionInstance;
  
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
  
        return adoptionInstance.getAdopters.call();
      }).then(function(adopters) {
        // Load pets.
        $.getJSON('../pets.json', function(data) {
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');

            for (i = 0; i < data.length; i ++) {

                if (adopters[i] !== '0x0000000000000000000000000000000000000000' && App.account == adopters[i]) {
                    petTemplate.find('.panel-title').text(data[i].name);
                    petTemplate.find('img').attr('src', data[i].picture);
                    petTemplate.find('.pet-breed').text(data[i].breed);
                    petTemplate.find('.pet-age').text(data[i].age);
                    petTemplate.find('.pet-location').text(data[i].location);
                    petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                    petsRow.append(petTemplate.html());
                } 
            }
        });

      }).catch(function(err) {
        console.log(err.message);
      });
      
    },
  
    handleAdopt: function(event) {
      event.preventDefault();
  
      var petId = parseInt($(event.target).data('id'));
  
      var adoptionInstance;
  
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
      
        var account = accounts[0];
      
        App.contracts.Adoption.deployed().then(function(instance) {
          adoptionInstance = instance;
      
          // Execute adopt as a transaction by sending account
          return adoptionInstance.adopt(petId, {from: account});
        }).then(function(result) {
          return App.markAdopted();
        }).catch(function(err) {
          console.log(err.message);
        });
        
      });
    }
  
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  