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
                        templateUrl: 'templates/summary.html',
                        controller: 'summaryCtrl'
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
            .state('results', {
                url: '/results',
                templateUrl: 'templates/results.html',
                controller: 'resultsCtrl',
                params: {
                    barName: 'ERROR'
                }
            })
        .state('line', {
            url: '/line',
            templateUrl: 'templates/line.html',
            controller: 'buttonCtrl',
            params: {
                barID: 'ERROR'
            }
        });


        $urlRouterProvider.otherwise("/tab/overview");

    });


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

barApp.controller('resultsCtrl', function($scope, $state, $cordovaGeolocation, $stateParams, $ionicPopup) {
    $scope.retrieve_data = function() {


        return firebase.database().ref('Data').once('value').then(function(snapshot) {

            var counter = 1;
            $scope.bar_stats = [];
            bar_stats = snapshot.val()

            for (i = 0; i < snapshot.numChildren(); i++){
                if(bar_stats[i+1]['name'] == $stateParams.barName)
                    counter = i+1
            }

            $scope.length = bar_stats[counter]['Line_length'];
            $scope.name = bar_stats[counter]['name'];
            $scope.barName = $stateParams.barName;


        });



    }

    $scope.retrieve_hours = function() {


        return firebase.database().ref('Bars').once('value').then(function(snapshot) {

            var counter = 1;
            $scope.bar_hours = [];
            $scope.bar_hours = snapshot.val()

            for (i = 0; i < snapshot.numChildren(); i++){
                if($scope.bar_hours[i+1]['bar'] == $stateParams.barName)
                    counter = i+1
            }

            $scope.hours = $scope.bar_hours[counter]['hours'];


            $scope.mondayHours = $scope.hours['Monday']
            $scope.tuesdayHours = $scope.hours['Tuesday']
            $scope.wednesdayHours = $scope.hours['Wednesday']
            $scope.thursdayHours = $scope.hours['Thursday']
            $scope.fridayHours = $scope.hours['Friday']
            $scope.saturdayHours = $scope.hours['Saturday']
            $scope.sundayHours = $scope.hours['Sunday']


        });



    }

    $scope.retrieve_data();
    $scope.retrieve_hours();

    $scope.back = function() {
         $state.go('tabs.summary');
    }

});

barApp.controller('buttonCtrl', function($scope, $state, $cordovaGeolocation, $ionicPopup, $stateParams, $filter) {
    $scope.back = function() {
        $state.go('tabs.overview');
    }

    $scope.help = function() {

            var alertPopup = $ionicPopup.alert({
                title: 'How to submit a post',
                template: 'Just click on the bar and the estimated wait time, and it will be recorded!'
            });
        alertPopup.then(function(res) {
            console.log('Thank you');
        });
    }

    $scope.line = function(barID) {
        $state.go('line', {
            barID: barID
        });
    }
    $scope.submitLong = function() {
        $scope.addData = function() {
            return firebase.database().ref('Data').once('value').then(function(snapshot) {
                console.log(snapshot.val()[$stateParams.barID]['long'])
                $scope.longOldVal = snapshot.val()[$stateParams.barID]['long']

                return firebase.database().ref('Data/' + $stateParams.barID + '/long').set($scope.longOldVal + 1)

            });
        }

        $scope.addTime = function() {
            return firebase.database().ref('Data').once('value').then(function(snapshot) {
                var date = new Date();
                $scope.date = $filter('date')(new Date(), 'yyyyMMddHH', '-0500');
                $scope.timestamp = parseInt($scope.date,10)
                return firebase.database().ref('Data/' + $stateParams.barID + '/lastTimestamp').set($scope.timestamp)
            });
        }

        $scope.addData()
        $scope.addTime()
        $state.go('tabs.overview');
    }

    $scope.submitMedium = function() {
        $scope.addData = function() {
            return firebase.database().ref('Data').once('value').then(function(snapshot) {
                console.log(snapshot.val()[$stateParams.barID]['medium'])
                $scope.mediumOldVal = snapshot.val()[$stateParams.barID]['medium']

                return firebase.database().ref('Data/' + $stateParams.barID + '/medium').set($scope.mediumOldVal + 1)

            });
        }

        $scope.addTime = function() {
            return firebase.database().ref('Data').once('value').then(function(snapshot) {
                var date = new Date();
                $scope.date = $filter('date')(new Date(), 'yyyyMMddHH', '-0500');
                $scope.timestamp = parseInt($scope.date,10)
                return firebase.database().ref('Data/' + $stateParams.barID + '/lastTimestamp').set($scope.timestamp)
            });
        }

        $scope.addData()
        $scope.addTime()
        $state.go('tabs.overview');
    }

    $scope.submitShort = function() {
        $scope.addData = function() {
            return firebase.database().ref('Data').once('value').then(function(snapshot) {
                console.log(snapshot.val()[$stateParams.barID]['short'])
                $scope.shortOldVal = snapshot.val()[$stateParams.barID]['short']

                return firebase.database().ref('Data/' + $stateParams.barID + '/short').set($scope.shortOldVal + 1)

            });
        }

        $scope.addTime = function() {
            return firebase.database().ref('Data').once('value').then(function(snapshot) {
                var date = new Date();
                $scope.date = $filter('date')(new Date(), 'yyyyMMddHH', '-0500');
                $scope.timestamp = parseInt($scope.date,10)
                return firebase.database().ref('Data/' + $stateParams.barID + '/lastTimestamp').set($scope.timestamp)
            });
        }

        $scope.addData()
        $scope.addTime()
        $state.go('tabs.overview');
    }

    $scope.submitNoLine = function() {
        $scope.addData = function() {
            return firebase.database().ref('Data').once('value').then(function(snapshot) {
                console.log(snapshot.val()[$stateParams.barID]['noline'])
                $scope.noLineOldVal = snapshot.val()[$stateParams.barID]['noline']

                return firebase.database().ref('Data/' + $stateParams.barID + '/noline').set($scope.noLineOldVal + 1)

            });
        }

        $scope.addTime = function() {
            return firebase.database().ref('Data').once('value').then(function(snapshot) {
                var date = new Date();
                $scope.date = $filter('date')(new Date(), 'yyyyMMddHH', '-0500');
                $scope.timestamp = parseInt($scope.date,10)
                return firebase.database().ref('Data/' + $stateParams.barID + '/lastTimestamp').set($scope.timestamp)
            });
        }

        $scope.addData()
        $scope.addTime()
        $state.go('tabs.overview');
    }

    $scope.todaysHours = function() {
        return firebase.database().ref('Bars').once('value').then(function(snapshot) {

            var counter = 1;
            $scope.bar_hours = [];
            $scope.bar_hours = snapshot.val()

            $scope.todaysDay = $filter('date')(new Date(), 'EEEE', '-0500');

            // $scope.todaysHoursField = $scope.hours[$scope.todaysDay]
            $scope.todaysHoursDoubleU = $scope.bar_hours[1]['hours'][$scope.todaysDay];
            $scope.todaysHoursWandos = $scope.bar_hours[2]['hours'][$scope.todaysDay];
            $scope.todaysHoursKK = $scope.bar_hours[3]['hours'][$scope.todaysDay];
            $scope.todaysHoursChasers = $scope.bar_hours[4]['hours'][$scope.todaysDay];
            $scope.todaysHoursWhiskeys = $scope.bar_hours[5]['hours'][$scope.todaysDay];
            $scope.todaysHoursNitty = $scope.bar_hours[6]['hours'][$scope.todaysDay];

        });
    }

    $scope.todaysHours();

    $scope.results = function(name) {
        //console.log(name);
        $state.go('results', {
            barName:name
        });
    }

});

barApp.controller('summaryCtrl', function($scope, $state, $cordovaGeolocation, $ionicPopup, $stateParams, $filter) {

    $scope.retrieve_data = function() {


        return firebase.database().ref('Data').once('value').then(function(snapshot) {

            var counter = 1;
            $scope.bar_stats = [];
            bar_stats = snapshot.val()

            for (i = 0; i < snapshot.numChildren(); i++){
                if(bar_stats[i+1]['name'] == $stateParams.barName)
                    counter = i+1
            }


            $scope.waitDoubleU = bar_stats[1]['Line_length'];
            $scope.waitWandos = bar_stats[2]['Line_length'];
            $scope.waitKK = bar_stats[3]['Line_length'];
            $scope.waitChasers = bar_stats[4]['Line_length'];
            $scope.waitWhiskeys = bar_stats[5]['Line_length'];
            $scope.waitNitty = bar_stats[6]['Line_length'];


            //Double U Progress Bar
            $scope.percentageDoubleU = 0;
            if(bar_stats[1]['Line_length']=='no line'){
                $scope.percentageDoubleU = 0;
            }
            if(bar_stats[1]['Line_length']=='short'){
                $scope.percentageDoubleU = 25;
            }
            if(bar_stats[1]['Line_length']=='medium'){
                $scope.percentageDoubleU = 75;
            }
            if(bar_stats[1]['Line_length']=='long'){
                $scope.percentageDoubleU = 100;
            }


            //Wando'sProgress Bar
            $scope.percentageWandos= 0;
            if(bar_stats[2]['Line_length']=='no line'){
                $scope.percentageWandos = 0;
            }
            if(bar_stats[2]['Line_length']=='short'){
                $scope.percentageWandos = 25;
            }
            if(bar_stats[2]['Line_length']=='medium'){
                $scope.percentageWandos = 75;
            }
            if(bar_stats[2]['Line_length']=='long'){
                $scope.percentageWandos = 100;
            }


            //KK Progress Bar
            $scope.percentageKK = 0;
            if(bar_stats[3]['Line_length']=='no line'){
                $scope.percentageKK = 0;
            }
            if(bar_stats[3]['Line_length']=='short'){
                $scope.percentageKK = 25;
            }
            if(bar_stats[3]['Line_length']=='medium'){
                $scope.percentageKK = 75;
            }
            if(bar_stats[3]['Line_length']=='long'){
                $scope.percentageKK = 100;
            }


            //Chasers Progress Bar
            $scope.percentageChasers = 0;
            if(bar_stats[4]['Line_length']=='no line'){
                $scope.percentageChasers = 0;
            }
            if(bar_stats[4]['Line_length']=='short'){
                $scope.percentageChasers = 25;
            }
            if(bar_stats[4]['Line_length']=='medium'){
                $scope.percentageChasers = 75;
            }
            if(bar_stats[4]['Line_length']=='long'){
                $scope.percentageChasers = 100;
            }


            //Whiskeys Progress Bar
            $scope.percentageWhiskeys = 0;
            if(bar_stats[5]['Line_length']=='no line'){
                $scope.percentageWhiskeys = 0;
            }
            if(bar_stats[5]['Line_length']=='short'){
                $scope.percentageWhiskeys = 25;
            }
            if(bar_stats[5]['Line_length']=='medium'){
                $scope.percentageWhiskeys = 75;
            }
            if(bar_stats[5]['Line_length']=='long'){
                $scope.percentageWhiskeys = 100;
            }

            //Nitty Progress Bar
            $scope.percentageNitty= 0;
            if(bar_stats[6]['Line_length']=='no line'){
                $scope.percentageNitty = 0;
            }
            if(bar_stats[6]['Line_length']=='short'){
                $scope.percentageNitty = 25;
            }
            if(bar_stats[6]['Line_length']=='medium'){
                $scope.percentageNitty = 75;
            }
            if(bar_stats[6]['Line_length']=='long'){
                $scope.percentageNitty = 100;
            }


        });




    }

    $scope.retrieve_data();

    $scope.help = function() {

        var alertPopup = $ionicPopup.alert({
            title: 'Help',
            template: 'This page displays the wait times for Madison bars. Click on a bar to view more information.'
        });
        alertPopup.then(function(res) {
            console.log('Thank you');
        });
    }

    $scope.line = function(barID) {
        $state.go('line', {
            barID: barID
        });
    };

    $scope.results = function(name) {
        //console.log(name);
        $state.go('results', {
            barName:name
        });
    }

});
