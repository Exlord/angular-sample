/**
 * Created by Exlord on 9/29/2016.
 */
(function (angular) {

    class LocationService {
        constructor($q, $timeout) {
            this.$q       = $q;
            this.$timeout = $timeout;
        }

        locateByBrowser() {
            let deferred = this.$q.defer();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        deferred.resolve(position);
                    },
                    (error)=> {
                        deferred.reject(error);
                    });
            } else
                deferred.reject();

            //if we are not able to get the location in 10 second
            //reject
            this.$timeout(function () {
                if(deferred.promise.$$state.status !== 1)
                    deferred.reject();
            },10000);

            return deferred.promise;
        }
    }

    LocationService.$inject = ['$q', '$timeout'];
    angular.module('myApp').service('LocationService', LocationService);
})(window.angular);