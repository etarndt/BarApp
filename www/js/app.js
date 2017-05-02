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


            $scope.mondayOpen = $scope.hours['Monday']['Open']
            $scope.mondayClose = $scope.hours['Monday']['Close']
            $scope.tuesdayOpen = $scope.hours['Tuesday']['Open']
            $scope.tuesdayClose = $scope.hours['Tuesday']['Close']
            $scope.wednesdayOpen = $scope.hours['Wednesday']['Open']
            $scope.wednesdayClose = $scope.hours['Wednesday']['Close']
            $scope.thursdayOpen = $scope.hours['Thursday']['Open']
            $scope.thursdayClose = $scope.hours['Thursday']['Close']
            $scope.fridayOpen = $scope.hours['Friday']['Open']
            $scope.fridayClose = $scope.hours['Friday']['Close']
            $scope.saturdayOpen = $scope.hours['Saturday']['Open']
            $scope.saturdayClose = $scope.hours['Saturday']['Close']
            $scope.sundayOpen = $scope.hours['Sunday']['Open']
            $scope.sundayClose = $scope.hours['Sunday']['Close']

            if ($scope.mondayOpen == "Closed") {
                $scope.mondayHours = "Closed"
            } else {
                $scope.mondayHours = $scope.mondayOpen + "-" + $scope.mondayClose
            }

            if ($scope.tuesdayOpen == "Closed") {
                $scope.tuesdayHours = "Closed"
            } else {
                $scope.tuesdayHours = $scope.tuesdayOpen + "-" + $scope.tuesdayClose
            }

            if ($scope.wednesdayOpen == "Closed") {
                $scope.wednesdayHours = "Closed"
            } else {
                $scope.wednesdayHours = $scope.wednesdayOpen + "-" + $scope.wednesdayClose
            }

            if ($scope.thursdayOpen == "Closed") {
                $scope.thursdayHours = "Closed"
            } else {
                $scope.thursdayHours = $scope.thursdayOpen + "-" + $scope.thursdayClose
            }

            if ($scope.fridayOpen == "Closed") {
                $scope.fridayHours = "Closed"
            } else {
                $scope.fridayHours = $scope.fridayOpen + "-" + $scope.fridayClose
            }

            if ($scope.saturdayOpen == "Closed") {
                $scope.saturdayHours = "Closed"
            } else {
                $scope.saturdayHours = $scope.saturdayOpen + "-" + $scope.saturdayClose
            }

            if ($scope.sundayOpen == "Closed") {
                $scope.sundayHours = "Closed"
            } else {
                $scope.sundayHours = $scope.sundayOpen + "-" + $scope.sundayClose
            }


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

    $scope.closedPost = function() {

        var alertPopup = $ionicPopup.alert({
            title: 'Help',
            template: 'Cant post-bar closed'
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

        // $scope.addDataTimeAndCheck = function() {
        //
        //     return firebase.database().ref('Bars').once('value').then(function(snapshot) {
        //
        //         var counter = 1;
        //         $scope.bar_hours = [];
        //         $scope.bar_hours = snapshot.val()
        //
        //         for (i = 0; i < snapshot.numChildren(); i++){
        //             if($scope.bar_hours[i+1]['bar'] == $stateParams.barName)
        //                 counter = i+1
        //         }
        //
        //         $scope.hours = $scope.bar_hours[counter]['hours'];
        //
        //         $scope.todaysDay = $filter('date')(new Date(), 'EEEE', '-0500');
        //         $scope.yesterdaysDay = $filter('date')(new Date(), 'EEEE', '-2900');
        //
        //
        //         $scope.currentDayOpen = $scope.hours[$scope.todaysDay]['Open']
        //         $scope.currentDayClose = $scope.hours[$scope.todaysDay]['Close']
        //
        //         $scope.yesterdayClose = $scope.hours[$scope.yesterdaysDay]['Close']
        //
        //         $scope.currTime = $filter('date')(new Date(), 'h', '-0500');
        //         $scope.currnTime = $filter('date')(new Date(), 'h', '-0400');
        //
        //     });
        //     if ($scope.currentDayOpen == "Closed") {
        //         if ($scope.yesterdayClose == "Closed") {
        //             $scope.closedPost()
        //         }
        //     } else {
        //         $scope.addData()
        //         $scope.addTime()
        //     }
        // }

        // $scope.addDataTimeAndCheck();

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


            $scope.todaysOpenDoubleU = $scope.bar_hours[1]['hours'][$scope.todaysDay]["Open"];
            $scope.todaysCloseDoubleU = $scope.bar_hours[1]['hours'][$scope.todaysDay]["Close"];
            $scope.todaysOpenWandos = $scope.bar_hours[2]['hours'][$scope.todaysDay]["Open"];
            $scope.todaysCloseWandos = $scope.bar_hours[2]['hours'][$scope.todaysDay]["Close"];
            $scope.todaysOpenKK = $scope.bar_hours[3]['hours'][$scope.todaysDay]["Open"];
            $scope.todaysCloseKK = $scope.bar_hours[3]['hours'][$scope.todaysDay]["Close"];
            $scope.todaysOpenChasers = $scope.bar_hours[4]['hours'][$scope.todaysDay]["Open"];
            $scope.todaysCloseChasers = $scope.bar_hours[4]['hours'][$scope.todaysDay]["Close"];
            $scope.todaysOpenWhiskeys = $scope.bar_hours[5]['hours'][$scope.todaysDay]["Open"];
            $scope.todaysCloseWhiskeys = $scope.bar_hours[5]['hours'][$scope.todaysDay]["Close"];
            $scope.todaysOpenNitty = $scope.bar_hours[6]['hours'][$scope.todaysDay]["Open"];
            $scope.todaysCloseNitty = $scope.bar_hours[6]['hours'][$scope.todaysDay]["Close"];


            if ($scope.todaysOpenDoubleU == "Closed") {
                $scope.todaysHoursDoubleU = $scope.todaysOpenDoubleU
            } else {
                $scope.todaysHoursDoubleU = $scope.todaysOpenDoubleU + "-" + $scope.todaysCloseDoubleU
            }

            if ($scope.todaysOpenWandos == "Closed") {
                $$scope.todaysHoursWandos = $scope.todaysOpenDoubleU
            } else {
                $scope.todaysHoursWandos = $scope.todaysOpenWandos + "-" + $scope.todaysCloseWandos
            }

            if ($scope.todaysOpenKK == "Closed") {
                $scope.todaysHoursKK = $scope.todaysOpenDoubleU
            } else {
                $scope.todaysHoursKK = $scope.todaysOpenKK + "-" + $scope.todaysCloseKK
            }

            if ($scope.todaysOpenChasers == "Closed") {
                $scope.todaysHoursChasers = $scope.todaysOpenDoubleU
            } else {
                $scope.todaysHoursChasers = $scope.todaysOpenChasers + "-" + $scope.todaysCloseChasers
            }

            if ($scope.todaysOpenWhiskeys == "Closed") {
                $scope.todaysHoursWhiskeys = $scope.todaysOpenDoubleU
            } else {
                $scope.todaysHoursWhiskeys = $scope.todaysOpenWhiskeys + "-" + $scope.todaysCloseWhiskeys
            }

            if ($scope.todaysOpenNitty == "Closed") {
                $scope.todaysHoursNitty = $scope.todaysOpenDoubleU
            } else {
                $scope.todaysHoursNitty = $scope.todaysOpenNitty + "-" + $scope.todaysCloseNitty
            }



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
