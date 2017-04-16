// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var barApp = angular.module('starter', ['ionic', 'ngCordova', "firebase"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tabs', {
                url: '/tab',
                    templateUrl: 'templates/tabs.html',
            })
            .state('tabs.overview', {
                url: '/overview',
                views: {
                    'overview-tab': {
                        templateUrl: 'templates/overview.html',
                        controller: 'overviewCtrl'
                    }
                }
            })
            .state('tabs.add', {
                url:'/add',
                views: {
                    'add-tab': {
                        templateUrl: 'templates/add.html',
                        controller: 'buttonCtrl'
                    }
                }
            })
            .state('tabs.summary', {
                url:'/summary',
                views: {
                    'summary-tab': {
                        templateUrl: 'templates/summary.html'
                    }
                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'templates/settings.html',
                controller: 'buttonCtrl'
            })
            .state('help', {
                url: '/help',
                templateUrl: 'templates/help.html',
                controller: 'buttonCtrl'
            })
        .state('line', {
            url: '/line',
            templateUrl: 'templates/line.html',
            controller: 'buttonCtrl'
        });


        $urlRouterProvider.otherwise("/tab/overview");

    });

    // array to store bar information - not working
    // var bars = [
    //     {
    //         bar: 'The Double U',
    //         lat: '43.0734',
    //         lon: '-89.3968'
    //     },
    //     {
    //         bar: 'Kollege Klub',
    //         lat: '43.0756',
    //         lon: '-89.3971'
    //     }
    // ]


    barApp.controller('overviewCtrl', function($scope, $state, $cordovaGeolocation) {
        var options = {timeout: 10000, enableHighAccuracy: true};

        // keep for testing

        // $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        //
        //     var latLng = new google.maps.LatLng(43.072932, -89.396565);
        //
        //     var mapOptions = {
        //         center: latLng,
        //         zoom: 17,
        //         mapTypeId: google.maps.MapTypeId.ROADMAP
        //     };
        //
        //     $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //     //Wait until the map is loaded
        //     google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        //
        //         var marker = new google.maps.Marker({
        //             map: $scope.map,
        //             animation: google.maps.Animation.DROP,
        //             position: latLng
        //         });
        //
        //         var infoWindow = new google.maps.InfoWindow({
        //             content: "Here I am!"
        //         });
        //
        //         google.maps.event.addListener(marker, 'click', function () {
        //             infoWindow.open($scope.map, marker);
        //         });
        //
        //     });
        // }, function(error){
        //     console.log("Could not get location");
        // });

        // Map Settings //
        $scope.initialise = function() {
            var myLatlng = new google.maps.LatLng(43.072932, -89.396565);
            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            // Geo Location /
            navigator.geolocation.getCurrentPosition(function(pos) {
                map.setCenter(new google.maps.LatLng(43.072932, -89.396565));
                var myLocation = new google.maps.Marker({
                    position: new google.maps.LatLng(43.072932, -89.396565),
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: "My Location",
                    content: "hardcoded at Grainger"

                });
                google.maps.event.addListener(myLocation, 'click', function(){
                    infoWindow.setContent('<h2>' + myLocation.title + '</h2>' + myLocation.content);
                    infoWindow.open($scope.map, myLocation);
                });
            });
            $scope.map = map;
            // Additional Markers //
            $scope.markers = [];
            var infoWindow = new google.maps.InfoWindow();
            var createMarker = function (info){
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(info.lat, info.long),
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    title: info.bar,
                    icon: "img/" + info.icon
                });
                marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
                google.maps.event.addListener(marker, 'click', function(){
                    infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                    infoWindow.open($scope.map, marker);
                });
                $scope.markers.push(marker);
            }

            // keep for testing

            // for (i = 0; i < cities.length; i++){
            //     createMarker(cities[i]);
            // }

            $scope.retrieve_data = function() {


                return firebase.database().ref('Bars').once('value').then(function(snapshot) {
                    console.log(snapshot.val()[1])

                    $scope.ListOfBars = []
                    ListOfBars = snapshot.val()
                    console.log(ListOfBars[1]['lat'])

                    console.log(snapshot.numChildren());
                    for (i = 0; i < snapshot.numChildren(); i++){
                        createMarker(ListOfBars[i+1]);
                    }
                    // console.log(cities[1])
                });


            }

            // keep this here but can be cleaned up eventually
            $scope.retrieve_data()

        };
        google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise());

        $scope.settingsClick = function() {
            $state.go('settings');
        }




    });

barApp.controller('buttonCtrl', function($scope, $state, $cordovaGeolocation) {

    $scope.back = function() {
        $state.go('tabs.overview');
    }

    $scope.backCreate = function() {
        $state.go('tabs.add');
    }

    $scope.help = function() {
        $state.go('help');
    }

    $scope.line = function() {
        $state.go('line');
    }
    $scope.submit = function() {
        $state.go('tabs.overview');
    }


});
