/// <reference path="../typings/tsd.d.ts" />

(function() {
    'use strict';

    angular.module('sla', ['firebase'])
        .constant('firebaseUrl', 'https://sla-monitor-dev.firebaseio.com/');
})();
