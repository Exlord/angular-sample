/**
 * Created by Exlord on 9/29/2016.
 */
(function (angular) {


    class LocationController {
        /**
         *
         * @param LocationService {LocationService}
         * @param WeatherService {WeatherService}
         * @param $interval
         */
        constructor(LocationService, WeatherService, $interval) {
            this.locationService = LocationService;
            this.weatherService  = WeatherService;
            this.$interval       = $interval;
            this.weather         = null;
            this.geoLocation     = null;
            this.postal          = null;
            this.country         = null;
            this.timer           = 10;
            this.interval        = null;
            this._askBrowserForLocation();
        }

        _askBrowserForLocation() {

            //s simple count down timer
            this.interval = this.$interval(()=> {
                if (this.timer > 0) {
                    this.timer = (this.timer - 0.1).toFixed(1);
                }
                else {
                    this.$interval.cancel(this.interval);
                    this.timer = 0;
                }
            }, 100);

            this.locationService.locateByBrowser()
                .then(position=> {
                    this.$interval.cancel(this.interval);
                    this.weatherService.getByCoordinates(position.coords).then(data=> {
                        this.geoLocation = position;
                        this.weather     = data;
                    });
                })
                .catch((error)=> {
                    this.geoLocation = false;
                })
        }

        submit(form) {
            if (this.postal && this.country && form.$valid) {
                this.country = this.country.toLowerCase();
                this.weatherService.getByZip(this.postal, this.country).then(data=> {
                    this.weather = data;
                });
            }
        }
    }

    LocationController.$inject = ['LocationService', 'WeatherService', '$interval'];
    angular.module('myApp').controller('LocationController', LocationController);
})(window.angular);
