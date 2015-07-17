/// <reference path="../typings/tsd.d.ts" />
var SLAClient;
(function (SLAClient) {
    angular.module('sla', ['firebase'])
        .constant('firebaseUrl', 'https://sla-monitor-dev.firebaseio.com/');
})(SLAClient || (SLAClient = {}));
