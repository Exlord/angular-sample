/**
 * Created by Exlord on 9/29/2016.
 */
(function (angular) {

    class WeatherService {
        constructor($http) {
            this.$http = $http;
            this.APPID = 'd328e9b0ee8c3239375b9d8d4e2d2a3c';
        }

        getByCoordinates(coords) {
            let params = {
                lat: coords.latitude,
                lon: coords.longitude,
            };
            return this._get(params)
        }

        getByZip(zip, country) {
            let params = {zip: zip + ',' + country};
            return this._get(params)
        }

        _get(params) {
            params       = params || {};
            params.appid = this.APPID;
            return this.$http(
                {
                    url   : 'http://api.openweathermap.org/data/2.5/weather',
                    type  : 'GET',
                    params: params
                }
            ).then(response=> {
                return response.data
            });
        }
    }

    WeatherService.$inject = ['$http'];
    angular.module('myApp').service('WeatherService', WeatherService);
})(window.angular);