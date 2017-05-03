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
                cache: false,
                views: {
                    'add-tab': {
                        templateUrl: 'templates/add.html',
                        controller: 'buttonCtrl'
                    }
                }
            })
            .state('tabs.summary', {
                url:'/summary',
                cache: false,
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


    barApp.controller('overviewCtrl', function($scope, $state, $cordovaGeolocation, $ionicHistory) {


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
            var myStyles =[
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ];
            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                clickableIcons: false,
                styles: myStyles
            };
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            // Geo Location /
            navigator.geolocation.getCurrentPosition(function(pos) {
                // map.setCenter(new google.maps.LatLng(43.072932, -89.396565));
                var currPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
                map.setCenter(currPos);
                var myLocation = new google.maps.Marker({
                    // position: new google.maps.LatLng(43.072932, -89.396565),
                    position: currPos,
                    map: map,
                    // animation: google.maps.Animation.DROP,
                    title: "Current Location",
                    // content: "hardcoded at Grainger",
                    icon: 'http://www.robotwoods.com/dev/misc/bluecircle.png'
                });
                google.maps.event.addListener(myLocation, 'click', function(){
                    infoWindow.setContent('<h2>' + myLocation.title);
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
                    // animation: google.maps.Animation.DROP,
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

barApp.controller('resultsCtrl', function($scope, $state, $cordovaGeolocation, $stateParams, $ionicPopup, $ionicHistory) {
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
        $ionicHistory.clearCache().then(function(){ $state.go('tabs.summary') })
         // $state.go('tabs.summary');
    }

});

barApp.controller('buttonCtrl', function($scope, $state, $cordovaGeolocation, $ionicPopup, $stateParams, $filter, $ionicHistory) {
    $scope.back = function() {
        $ionicHistory.clearCache().then(function(){ $state.go('tabs.overview') })
        // $state.go('tabs.overview');
    }

    $scope.backToCreateNew = function() {
        $ionicHistory.clearCache().then(function(){ $state.go('tabs.add') })
        // $state.go('tabs.add');
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
            title: 'Woops',
            template: 'The bar is currently closed. Please try again later.'
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

    $scope.addDataTimeAndCheck = function(ID) {

        var closed = 0;

        var amCount = 0;
        var pmCount = 0;

        var openIsPM = 0;
        var closeIsPM = 0;

        var fcnCount = 0;

        return firebase.database().ref('Bars').once('value').then(function(snapshot) {

            var counter = 1;
            $scope.bar_hours = [];
            $scope.bar_hours = snapshot.val()

            for (i = 0; i < snapshot.numChildren(); i++){
                if($scope.bar_hours[i+1]['bar'] == $stateParams.barName)
                    counter = i+1
            }

            $scope.hours = $scope.bar_hours[ID]['hours'];


            $scope.todaysDay = $filter('date')(new Date(), 'EEEE', '-0500');
            $scope.yesterdaysDay = $filter('date')(new Date(), 'EEEE', '-2900');

            // console.log("todays day: " + $scope.todaysDay);
            // console.log("yesterdays day: " + $scope.yesterdaysDay);

            $scope.currentDayOpen = $scope.hours[$scope.todaysDay]['Open'];
            $scope.currentDayClose = $scope.hours[$scope.todaysDay]['Close'];

            $scope.yesterdayDayOpen = $scope.hours[$scope.yesterdaysDay]['Open'];
            $scope.yesterdayDayClose = $scope.hours[$scope.yesterdaysDay]['Close'];

            // console.log("current day open: " + $scope.currentDayOpen);
            // console.log("current day close: " + $scope.currentDayClose);


            // function to convert number of minutes since 0:00
            function getMinutes(str) {
                // split like this cause in DB the format is hh:mm AM/PM
                var time = str.split(/:| /);
                fcnCount+=1;
                if (time[2] == "PM") {
                    pmCount+=1;
                    if (fcnCount == 1) {
                        openIsPM = 1;
                    }
                    else {
                        closeIsPM = 1;
                    }
                }
                else {
                    amCount++;
                }
                return time[0] * 60 + time[1] * 1;
            }

            // similar function to get curr time in same form to compare with above
            function getMinutesNow() {
                var timeNow = new Date();
                return timeNow.getHours()*60+timeNow.getMinutes();
            }

            if ($scope.currentDayOpen == "Closed") {
                closed = 1;
                console.log("Closed today!")
                $scope.closedPost();
            }
            else {
                var now = getMinutesNow();
                // rare case where it's between 12 am and 230 am
                if (now <= 150) {
                    if ($scope.yesterdayDayOpen == "Closed") {
                        closed = 1;
                        console.log("Still closed!");
                        $scope.closedPost();
                    }
                    else {
                        // compare minutes of previous day's hours and update now to be full day's minutes
                        now += getMinutes('24:00 ');
                        var start = getMinutes($scope.yesterdayDayOpen);
                        var end = getMinutes($scope.yesterdayDayClose);
                    }
                }
                // after 230 am, thus we know only curr day hours matter
                else {
                    var start = getMinutes($scope.currentDayOpen);
                    var end = getMinutes($scope.currentDayClose);
                }


                // case 1: start time is AM, close time is PM
                if (amCount == 1 && closeIsPM == 1) {
                    // rare case where don't want to add if it's between 12:00 PM and 12:59 PM
                    if (!(end < 780 && end > 660))
                    end+= getMinutes('12:00 ');
                }
                // case 2: start time is AM, close time is AM
                else if (amCount == 2) {
                    // rare case if closing time is early in the morning the next day
                    if (end <= 150)
                    end+= getMinutes('24:00 ');
                    else
                        end+= getMinutes('12:00 ');
                }
                // case 3: start time is PM, close time is PM
                else if (pmCount == 2) {
                    start += getMinutes('12:00 ');
                    end += getMinutes('12:00 ');
                }
                // case 4: start time is PM, close time is AM
                else if (amCount == 1 || openIsPM) {
                    // rare case where don't want to add if it's between 12:00 PM and 12:59 PM
                    if (!(start < 780 && start > 660))
                    start += getMinutes('12:00 ');

                    end += getMinutes('12:00 ');
                }

                // case if start time is still greater than end time
                if (start >= end) end += getMinutes('12:00 ');


                console.log("start: " + start);
                console.log("end: " + end);
                console.log("now: " + now);

                if ((now > start) && (now < end)) {
                    console.log("good to post!");
                    $scope.addData()
                    $scope.addTime()
                }
                else {
                    if (closed != 1) {
                        console.log("not within the right hours. Sorry");
                        $scope.closedPost();
                    }
                }
            }
        });
    }


    $scope.submitLong = function() {
        $scope.addData = function () {
            return firebase.database().ref('Data').once('value').then(function (snapshot) {
                console.log(snapshot.val()[$stateParams.barID]['long'])
                $scope.longOldVal = snapshot.val()[$stateParams.barID]['long']

                return firebase.database().ref('Data/' + $stateParams.barID + '/long').set($scope.longOldVal + 1)

            });
        }

        $scope.addTime = function () {
            return firebase.database().ref('Data').once('value').then(function (snapshot) {
                var date = new Date();
                $scope.date = $filter('date')(new Date(), 'yyyyMMddHH', '-0500');
                $scope.timestamp = parseInt($scope.date, 10)
                return firebase.database().ref('Data/' + $stateParams.barID + '/lastTimestamp').set($scope.timestamp)
            });
        }

        $scope.addDataTimeAndCheck($stateParams.barID);

        $ionicHistory.clearCache().then(function(){ $state.go('tabs.overview') })
        // $state.go('tabs.overview');
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

        $scope.addDataTimeAndCheck($stateParams.barID);

        $ionicHistory.clearCache().then(function(){ $state.go('tabs.overview') })
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

        $scope.addDataTimeAndCheck($stateParams.barID);

        $ionicHistory.clearCache().then(function(){ $state.go('tabs.overview') })
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

        $scope.addDataTimeAndCheck($stateParams.barID);

        $ionicHistory.clearCache().then(function(){ $state.go('tabs.overview') })
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

    $scope.isBarOpen = function(ID) {

        var closed = 0;

        var amCount = 0;
        var pmCount = 0;

        var openIsPM = 0;
        var closeIsPM = 0;

        var fcnCount = 0;

        $scope.dog = firebase.database().ref('Bars').once('value').then(function(snapshot) {

            var counter = 1;
            $scope.bar_hours = [];
            $scope.bar_hours = snapshot.val()

            for (i = 0; i < snapshot.numChildren(); i++){
                if($scope.bar_hours[i+1]['bar'] == $stateParams.barName)
                    counter = i+1
            }

            $scope.hours = $scope.bar_hours[ID]['hours'];


            $scope.todaysDay = $filter('date')(new Date(), 'EEEE', '-0500');
            $scope.yesterdaysDay = $filter('date')(new Date(), 'EEEE', '-2900');

            // console.log("todays day: " + $scope.todaysDay);
            // console.log("yesterdays day: " + $scope.yesterdaysDay);

            $scope.currentDayOpen = $scope.hours[$scope.todaysDay]['Open'];
            $scope.currentDayClose = $scope.hours[$scope.todaysDay]['Close'];

            $scope.yesterdayDayOpen = $scope.hours[$scope.yesterdaysDay]['Open'];
            $scope.yesterdayDayClose = $scope.hours[$scope.yesterdaysDay]['Close'];

            // console.log("current day open: " + $scope.currentDayOpen);
            // console.log("current day close: " + $scope.currentDayClose);


            // function to convert number of minutes since 0:00
            function getMinutes(str) {
                // split like this cause in DB the format is hh:mm AM/PM
                var time = str.split(/:| /);
                fcnCount+=1;
                if (time[2] == "PM") {
                    pmCount+=1;
                    if (fcnCount == 1) {
                        openIsPM = 1;
                    }
                    else {
                        closeIsPM = 1;
                    }
                }
                else {
                    amCount++;
                }
                return time[0] * 60 + time[1] * 1;
            }

            // similar function to get curr time in same form to compare with above
            function getMinutesNow() {
                var timeNow = new Date();
                return timeNow.getHours()*60+timeNow.getMinutes();
            }

            if ($scope.currentDayOpen == "Closed") {
                closed = 1;
                console.log("Closed today!")
                return 0
            }
            else {
                var now = getMinutesNow();
                // rare case where it's between 12 am and 230 am
                if (now <= 150) {
                    if ($scope.yesterdayDayOpen == "Closed") {
                        closed = 1;
                        console.log("Still closed!");
                        return 0
                    }
                    else {
                        // compare minutes of previous day's hours and update now to be full day's minutes
                        now += getMinutes('24:00 ');
                        var start = getMinutes($scope.yesterdayDayOpen);
                        var end = getMinutes($scope.yesterdayDayClose);
                    }
                }
                // after 230 am, thus we know only curr day hours matter
                else {
                    var start = getMinutes($scope.currentDayOpen);
                    var end = getMinutes($scope.currentDayClose);
                }


                // case 1: start time is AM, close time is PM
                if (amCount == 1 && closeIsPM == 1) {
                    // rare case where don't want to add if it's between 12:00 PM and 12:59 PM
                    if (!(end < 780 && end > 660))
                        end+= getMinutes('12:00 ');
                }
                // case 2: start time is AM, close time is AM
                else if (amCount == 2) {
                    // rare case if closing time is early in the morning the next day
                    if (end <= 150)
                        end+= getMinutes('24:00 ');
                    else
                        end+= getMinutes('12:00 ');
                }
                // case 3: start time is PM, close time is PM
                else if (pmCount == 2) {
                    start += getMinutes('12:00 ');
                    end += getMinutes('12:00 ');
                }
                // case 4: start time is PM, close time is AM
                else if (amCount == 1 || openIsPM) {
                    // rare case where don't want to add if it's between 12:00 PM and 12:59 PM
                    if (!(start < 780 && start > 660))
                        start += getMinutes('12:00 ');

                    end += getMinutes('12:00 ');
                }

                // case if start time is still greater than end time
                if (start >= end) end += getMinutes('12:00 ');


                console.log("start: " + start);
                console.log("end: " + end);
                console.log("now: " + now);

                if ((now > start) && (now < end)) {
                    console.log("good to post!");
                    return 1
                }
                else {
                    if (closed != 1) {
                        console.log("not within the right hours. Sorry");
                        return 0
                    }
                }
            }
        });
        return $scope.dog
    };

    // console.log($scope.isBarOpen(1))

    $scope.retrieve_data = function() {

        return firebase.database().ref('Data').once('value').then(function(snapshot) {

            var counter = 1;
            $scope.bar_stats = [];
            bar_stats = snapshot.val()

            for (i = 0; i < snapshot.numChildren(); i++){
                if(bar_stats[i+1]['name'] == $stateParams.barName)
                    counter = i+1
            }

            $scope.isBarOpen(1).then(function(res){
                // console.log(res)
                if (res == 1) {
                    $scope.waitDoubleU = bar_stats[1]['Line_length'];
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
                } else {
                    $scope.waitDoubleU = "Closed"
                    $scope.percentageDoubleU = 0;
                }
            })

            $scope.isBarOpen(2).then(function(res){
                // console.log(res)
                if (res == 1) {
                    $scope.waitWandos = bar_stats[2]['Line_length'];
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
                } else {
                    $scope.waitWandos = "Closed"
                    $scope.percentageWandos= 0;
                }
            })

            $scope.isBarOpen(3).then(function(res){
                // console.log(res)
                if (res == 1) {
                    $scope.waitKK = bar_stats[3]['Line_length'];
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
                } else {
                    $scope.waitKK = "Closed"
                    $scope.percentageKK = 0;
                }
            })

            $scope.isBarOpen(4).then(function(res){
                // console.log(res)
                if (res == 1) {
                    $scope.waitChasers = bar_stats[4]['Line_length'];
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
                } else {
                    $scope.waitChasers = "Closed"
                    $scope.percentageChasers = 0;
                }
            })

            $scope.isBarOpen(5).then(function(res){
                // console.log(res)
                if (res == 1) {
                    $scope.waitWhiskeys = bar_stats[5]['Line_length'];
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
                } else {
                    $scope.waitWhiskeys = "Closed"
                    $scope.percentageWhiskeys = 0;
                }
            })

            $scope.isBarOpen(6).then(function(res){
                // console.log(res)
                if (res == 1) {
                    $scope.waitNitty = bar_stats[6]['Line_length'];
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
                } else {
                    $scope.waitNitty = "Closed"
                    $scope.percentageNitty= 0;
                }
            })

            // $scope.waitDoubleU = bar_stats[1]['Line_length'];
            // $scope.waitWandos = bar_stats[2]['Line_length'];
            // $scope.waitKK = bar_stats[3]['Line_length'];
            // $scope.waitChasers = bar_stats[4]['Line_length'];
            // $scope.waitWhiskeys = bar_stats[5]['Line_length'];
            // $scope.waitNitty = bar_stats[6]['Line_length'];


            // //Double U Progress Bar
            // $scope.percentageDoubleU = 0;
            // if(bar_stats[1]['Line_length']=='no line'){
            //     $scope.percentageDoubleU = 0;
            // }
            // if(bar_stats[1]['Line_length']=='short'){
            //     $scope.percentageDoubleU = 25;
            // }
            // if(bar_stats[1]['Line_length']=='medium'){
            //     $scope.percentageDoubleU = 75;
            // }
            // if(bar_stats[1]['Line_length']=='long'){
            //     $scope.percentageDoubleU = 100;
            // }
            //
            //
            // //Wando'sProgress Bar
            // $scope.percentageWandos= 0;
            // if(bar_stats[2]['Line_length']=='no line'){
            //     $scope.percentageWandos = 0;
            // }
            // if(bar_stats[2]['Line_length']=='short'){
            //     $scope.percentageWandos = 25;
            // }
            // if(bar_stats[2]['Line_length']=='medium'){
            //     $scope.percentageWandos = 75;
            // }
            // if(bar_stats[2]['Line_length']=='long'){
            //     $scope.percentageWandos = 100;
            // }
            //
            //
            // //KK Progress Bar
            // $scope.percentageKK = 0;
            // if(bar_stats[3]['Line_length']=='no line'){
            //     $scope.percentageKK = 0;
            // }
            // if(bar_stats[3]['Line_length']=='short'){
            //     $scope.percentageKK = 25;
            // }
            // if(bar_stats[3]['Line_length']=='medium'){
            //     $scope.percentageKK = 75;
            // }
            // if(bar_stats[3]['Line_length']=='long'){
            //     $scope.percentageKK = 100;
            // }
            //
            //
            // //Chasers Progress Bar
            // $scope.percentageChasers = 0;
            // if(bar_stats[4]['Line_length']=='no line'){
            //     $scope.percentageChasers = 0;
            // }
            // if(bar_stats[4]['Line_length']=='short'){
            //     $scope.percentageChasers = 25;
            // }
            // if(bar_stats[4]['Line_length']=='medium'){
            //     $scope.percentageChasers = 75;
            // }
            // if(bar_stats[4]['Line_length']=='long'){
            //     $scope.percentageChasers = 100;
            // }
            //
            //
            // //Whiskeys Progress Bar
            // $scope.percentageWhiskeys = 0;
            // if(bar_stats[5]['Line_length']=='no line'){
            //     $scope.percentageWhiskeys = 0;
            // }
            // if(bar_stats[5]['Line_length']=='short'){
            //     $scope.percentageWhiskeys = 25;
            // }
            // if(bar_stats[5]['Line_length']=='medium'){
            //     $scope.percentageWhiskeys = 75;
            // }
            // if(bar_stats[5]['Line_length']=='long'){
            //     $scope.percentageWhiskeys = 100;
            // }
            //
            // //Nitty Progress Bar
            // $scope.percentageNitty= 0;
            // if(bar_stats[6]['Line_length']=='no line'){
            //     $scope.percentageNitty = 0;
            // }
            // if(bar_stats[6]['Line_length']=='short'){
            //     $scope.percentageNitty = 25;
            // }
            // if(bar_stats[6]['Line_length']=='medium'){
            //     $scope.percentageNitty = 75;
            // }
            // if(bar_stats[6]['Line_length']=='long'){
            //     $scope.percentageNitty = 100;
            // }


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
