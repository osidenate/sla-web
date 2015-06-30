/// <reference path="../../typings/tsd.d.ts" />

angular.module('sla')
    .directive('liveMonitor', [
        '$firebaseObject',
        'firebaseUrl',
        '$interval',
        function($firebaseObject, firebaseUrl, $interval) {
            return {
                scope: {
                    configId: '@'
                },
                templateUrl: 'components/live-monitor/live-monitor.htm',
                link: function(scope, iElement, iAttrs) {
                    var monitorRef = new Firebase(firebaseUrl + scope.configId);
                    var pingInfo = $firebaseObject(monitorRef);
                    var latestPing = $firebaseObject(monitorRef.child('latestPing'));
                    var updateStatus;

                    pingInfo.$loaded()
                        .then(function() {
                            scope.finishedLoadingConfig = true;

                            updateStatus = $interval(function() {
                                // The monitor should be considered offline if it missed three consecutive status updates
                                // The maximum time between a status update should be (pollInterval + timeout)
                                // We also add 250ms to take into account network delays
                                var pollInterval = pingInfo.interval;
                                var timeout = pingInfo.timeout;
                                var timedOutLength = 3 * (pollInterval + timeout) + 250;

                                var latestPingTime = new Date(latestPing.datetime).getTime();
                                var offlineTime = Date.now() - timedOutLength;

                                scope.monitorStatus = latestPingTime > offlineTime ? 'Online' : 'Offline';
                            }, 250);
                        });

                    scope.finishedLoadingConfig = false;
                    scope.pingInfo = pingInfo;
                    scope.latestPing = latestPing;
                    scope.monitorStatus = '';

                    iElement.on('$destory', function() {
                        $interval.cancel(updateStatus);
                    });
                }
            };
        }
    ]);
