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

  var balDataRef = new Firebase('https://angfirestockapp.firebaseio.com/balance');
  var ref = $firebase(balDataRef);

  var balance = 0;

  $scope.addBal = function() {
    var amount = $('#cashInput').val();
    var total = parseFloat(amount);

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
  balDataRef.on('value', function(data) {
    var bal = data.val();
    var key = data.key();
    console.log(bal, key);
    $('#total').text('Balance: $' + bal.balance);
    balance = bal.balance;
  });



  var portfolio = [];

  $scope.makePortfolio = function() {
    var input = $('#portfolioInput').val();
    var display = '<tr>"'+ input +'"</tr>';
    console.log(input);
    $('#showPort').append(display);
  }

  $scope.buyStock = function() {
    // console.log('z');
    var symbol = $('#symbol').val().toUpperCase();
    var shares = $('#numShares').val() * 1;
    var select = $('#portfolioSelect').val();
    var url = 'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=' + symbol + '&callback=?';

    $.getJSON(url, function(data) {
      console.log(data);
      var name = data.Name;
      var symbol = data.Symbol;
      var price = data.LastPrice;
      var total = price * shares;
      total.toFixed(2);
      console.log(name, symbol, price, select, total);
    })
  }
}]);
