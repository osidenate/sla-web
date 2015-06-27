/// <reference path="../../typings/tsd.d.ts" />

angular.module('sla')
    .directive('liveMonitor', [
        '$firebaseObject',
        'firebaseUrl',
        function($firebaseObject, firebaseUrl) {
            return {
                scope: {
                    configId: '@'
                },
                templateUrl: 'components/live-monitor/live-monitor.htm',
                link: function(scope, iElement, iAttrs) {
                    var ref = new Firebase(firebaseUrl);
                    scope.pingInfo = $firebaseObject(ref.child(scope.configId));
                }
            };
        }
    ]);
