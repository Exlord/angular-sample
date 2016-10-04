/**
 * Created by Exlord on 9/29/2016.
 */
(function (angular) {

    function weatherDirective() {
        return {
            restrict        : 'E',
            templateUrl     : '/components/weather/weather.directive.html',
            scope           : {
                weather: '=',
            },
            controller      : WeatherDirectiveController,
            controllerAs    : 'ctrl',
            bindToController: true
        }
    }

    WeatherDirectiveController.$inject = ['$scope'];
    function WeatherDirectiveController($scope) { }


    angular.module('myApp').directive('exlordWeather', weatherDirective);
})(window.angular);