'use strict';

(function (angular) {
    let app = angular
        .module('myApp', ['ui.router', 'oc.lazyLoad', 'ngSanitize', 'cfp.loadingBar', 'angular-loading-bar'])
        .provider('lazyLoading', LazyLoadingProvider)
        .config(['$controllerProvider', '$provide', '$compileProvider', configureLazyLoading])
        .config(['$provide', configureTemplateFactory])
        .config(['$httpProvider', httpResponseErrorHandler])
        .config(['$httpProvider', function ($httpProvider) { }])
        .config(['$compileProvider', function ($compileProvider) {
            //     $compileProvider.debugInfoEnabled(DEV_ENV);
        }]);

    function configureLazyLoading($controllerProvider, $provide, $compileProvider) {
        // Let's keep the older references.
        app._controller = app.controller;
        app._service    = app.service;
        app._factory    = app.factory;
        app._value      = app.value;
        app._directive  = app.directive;

        // Provider-based controller.
        app.controller = function (name, constructor) {
            $controllerProvider.register(name, constructor);
            return ( this );
        };
        // Provider-based service.
        app.service    = function (name, constructor) {
            $provide.service(name, constructor);
            return ( this );
        };
        // Provider-based factory.
        app.factory    = function (name, factory) {
            $provide.factory(name, factory);
            return ( this );
        };
        // Provider-based value.
        app.value      = function (name, value) {
            $provide.value(name, value);
            return ( this );
        };
        // Provider-based directive.
        app.directive  = function (name, factory) {
            $compileProvider.directive(name, factory);
            return ( this );
        };
        // NOTE: You can do the same thing with the "filter"
        // and the "$filterProvider"; but, I don't really use
        // custom filters.
    }

    function configureTemplateFactory($provide) {
        // Set a suffix outside the decorator function
        // var cacheBuster = DEV_ENV ? Date.now().toString() : REVISION;
        var cacheBuster = Date.now().toString();

        function templateFactoryDecorator($delegate) {
            var fromUrl       = angular.bind($delegate, $delegate.fromUrl);
            $delegate.fromUrl = function (url, params) {
                if (url !== null && angular.isDefined(url) && angular.isString(url)) {
                    url += (url.indexOf("?") === -1 ? "?" : "&");
                    url += "v=" + cacheBuster;
                }

                return fromUrl(url, params);
            };

            return $delegate;
        }

        $provide.decorator('$templateFactory', ['$delegate', templateFactoryDecorator]);
    }

    function httpResponseErrorHandler($httpProvider) {

        var interceptor = ['$rootScope', '$q', function ($rootScope, $q) {

            return {
                //'request': function (config) {
                //    return config;
                //},

                //'response': function (response) {
                //    console.log(response.status);
                //    return response;
                //},

                'responseError': function (rejection) {

                    //general error handling, show a global error for ajax

                    return $q.reject(rejection);
                }
            };
        }];

        $httpProvider.interceptors.push(interceptor);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    LazyLoadingProvider.$inject = [];
    function LazyLoadingProvider() {

        this.$get = function () {
            return this;
        };
        this.load = function (deps) {
            return {
                load: ['$q', '$rootScope', '$ocLazyLoad', 'cfpLoadingBar',
                       function ($q, $rootScope, $ocLazyLoad, cfpLoadingBar) {
                           cfpLoadingBar.start();
                           var p = $ocLazyLoad.load(deps, {cache: false});
                           p.then(function () {
                               cfpLoadingBar.complete();
                           });
                           return p;
                       }]
            };
        };
    }

})(window.angular);