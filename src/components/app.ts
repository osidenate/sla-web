/// <reference path="../typings/tsd.d.ts" />

module SLAClient {
    angular.module('sla', ['firebase'])
        .constant('firebaseUrl', 'https://sla-monitor-dev.firebaseio.com/');
}
