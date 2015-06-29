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
                    // TODO Use $loaded promise to display loading spinner until component is loaded

                    // Setup Firebase bindings
                    var monitorRef = new Firebase(firebaseUrl + scope.configId);
                    scope.pingInfo = $firebaseObject(monitorRef);

                    scope.latestPing = $firebaseObject(monitorRef.child('latestPing'));

                    scope.getRtt = function() {
                        return scope.latestPing.rtt;
                    };

                    // TODO Shows 'offline' / 'online' fine when page is reloaded but
                    // does not switch from online to offline when latency monitor stops
                    // since no firebase event is sent (do we need to using polling instead?) $interval
                    scope.getStatus = function() {
                        var latestPingTime = new Date(scope.latestPing.datetime).getTime();
                        var oneMinuteAgo = Date.now() - (60 * 1000);

                        // Monitor is online if the latest ping is less than a minute old
                        if (latestPingTime > oneMinuteAgo) {
                            return 'Live';
                        }
                        else {
                            return 'Offline';
                        }
                    };
                }
            };
        }
    ]);
