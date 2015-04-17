'use strict';

angular.module('myApp.welcome', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/welcome', {
    templateUrl: 'welcome/welcome.html',
    controller: 'WelcomeCtrl'
  });
}])

.controller('WelcomeCtrl', ['$scope', 'CommonProp', '$firebase', function($scope, CommonProp, $firebase) {
  $scope.username = CommonProp.getUser();

  var portDataRef = new Firebase('https://angfirestockapp.firebaseio.com/portfolios');
  var balDataRef = new Firebase('https://angfirestockapp.firebaseio.com/balance');
  var ref = $firebase(balDataRef);

  var balance = 0;

  $scope.addBal = function() {
    var amount = $('#cashInput').val();
    var total = parseFloat(amount);

    if (!amount) {
      alert('Please enter some $$$');
    } else {
    // balDataRef.push({amount: amount});
    balance += total;
    balDataRef.update({balance: balance});
    // balDataRef.on('value', function(data) {
    //   var bal = data.val();
    //   console.log(bal);
    //   $('#total').text('Balance: $' + bal.balance);
    //   balance = bal.balance;
    // });
    }
  }
  balDataRef.on('value', function(data) {
    var bal = data.val();
    var key = data.key();
    console.log(bal, key);
    $('#total').text('Balance: $' + bal.balance);
    balance = bal.balance;
  });


  var portfolios;
  portfolios = portDataRef.child('portfolios');

  $scope.makePortfolio = function() {
    var name = $('#portfolioInput').val();
    var port = {name: name};
    portfolios.push(port);
    console.log(name, port);
    // $('#showPort').append(display);
  }

  portfolios.on('child_added', createPortfolio);

  function createPortfolio(data) {
    var portfolio = data.val();
    var portName = portfolio.name;
    var key = data.key();
    // var keyChild = key.children();
    console.log(key);

    // var $portDiv = $('<div id="'+ portName +'">');
    var $option = $('<option>');
    $option.html(portName);
    $('#portfolioSelect').append($option);
    // $('#displayStocks').append($portDiv);
  }

  $scope.buyStock = function() {
    // console.log('z');
    var symbol = $('#symbol').val().toUpperCase();
    var shares = $('#numShares').val() * 1;
    var select = $('#portfolioSelect').val();
    var url = 'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=' + symbol + '&callback=?';
    var position;
    var $sell;

    $.getJSON(url, function(data) {
      if (balance === 0) {
        alert('No money');
      } else {
      console.log(data);
      $sell = $('<input type="button" id="sell" value ="Sell" />');
      var name = data.Name;
      var symbol = data.Symbol;
      var price = data.LastPrice;
      position = parseFloat(price * shares);
      position.toFixed(2);
      console.log(name, symbol, price, select, position);

      var $div = $('<div>');
      $div.addClass('stockDisplay');
      var $title = select;
      var display = $div.html($title + '<br />' + 'Name: ' + name + '<br />' + 'Symbol: ' + symbol + '<br />' + 'Price: $' + price + '<br />' + 'Total: $' + position + '<br />');
      display.append($sell);
      $('#displayStocks').append(display);

      balance = balance - position;
      console.log('Remaining: $' + balance);
      balDataRef.update({balance: balance});
      balance.toFixed(2);

      $('#sell').click(function() {
        $('#total').html('Balance: $' + (balance += position));
        $div.remove();
        balDataRef.update({balance: balance});
      })
    }
    });
  }
}]);
