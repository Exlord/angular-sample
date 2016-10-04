/**
 * Created by Exlord on 9/29/2016.
 */
(function (angular) {
    angular
        .module('myApp')
        .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 'lazyLoadingProvider',
                 function ($locationProvider, $stateProvider, $urlRouterProvider, lazyLoader) {
                     $locationProvider.hashPrefix('!');
                     $urlRouterProvider.otherwise("/weather");

                     $stateProvider
                         .state('weather', {
                             url         : "/weather",
                             templateUrl : '/location/location.html',
                             controller  : 'LocationController',
                             controllerAs: 'locCtrl',
                             resolve     : lazyLoader.load(
                                 [
                                     '/components/weather/weather.service.js',
                                     '/components/weather/weather.directive.js',
                                     '/location/location.service.js',
                                     '/location/location.controller.js',
                                 ]
                             )
                         })
                 }])
})(window.angular);