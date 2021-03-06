App = {
  web3Provider: null,
  contracts: {},
  
  
  

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
  if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    App.getMetaskAccountID()
    return App.initContract();
  },


  getMetaskAccountID: function () {
    web3 = new Web3(App.web3Provider);

    // Retrieving accounts
    web3.eth.getAccounts(function (err, res) {
        if (err) {
            console.log('Error:', err);
            return;
        }
        console.log('getMetaskID:', res);
        App.metamaskAccountID = res[0];

    })
},

  initContract: function() {
    $.getJSON('ExpenseTracker.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var ExpenseTrackerArtifact = data;
      App.contracts.ExpenseTracker = TruffleContract(ExpenseTrackerArtifact);
    
      // Set the provider for our contract
      App.contracts.ExpenseTracker.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      console.log("contract",  App.web3Provider);
      return App.render();
    });
  },



  listenForEvents: function() {
    App.contracts.ExpenseTracker.deployed().then(function(instance) {
      instance.Transfer({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        App.render();
      })
    });
  },

  render: function() {
    var ExpenseTrackerInstance;

        // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
   
    App.contracts.ExpenseTracker.deployed().then(function(instance) {
      bal_contract = instance;
      return bal_contract.Total_Balance();
    }).then(function(bal){
      $("#balance").html(+ bal);

    });

    $("#deposit").click(function(){
      
      amt= parseInt($("#Income_amount").val());
      App.contracts.ExpenseTracker.deployed().then(function(instance){
        web3.eth.defaultAccount = ethereum._state.accounts[0]
        send_amount=instance;
        return send_amount.Add_Income(amt).send({from:App.account});
      }).then(function(tx){
        console.log(tx);
      }).catch(function(tx){
        console.log(tx);
      })
      
    });
    $("#withdraw").click(function(){
      
      amt= parseInt($("#Expense_amount").val());
      App.contracts.ExpenseTracker.deployed().then(function(instance){
        web3.eth.defaultAccount = ethereum._state.accounts[0]
        send_amount=instance;
        return send_amount.Add_Expense(amt).send({from:App.account});
      }).then(function(tx){
        console.log(tx);
      }).catch(function(tx){
        console.log(tx);
      })
      
    });

    
    
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
