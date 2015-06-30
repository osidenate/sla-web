/// <reference path="../../typings/tsd.d.ts" />

module LiveMonitor {
    interface PingInfo extends AngularFireObject {
        configId: number,
        displayFrom: string,
        displayTo: string,
        host: string,
        interval: number,
        latestPing: LatestPing,
        timeout: number,
    }

    interface LatestPing extends Object {
        datetime: string,
        rtt: number,
        status: string
    }

    /**
     * @description
     * Determines the status of the Latency Monitor based on the latest ping's timestamp.
     * The monitor is considered offline if it missed three consecutive status updates.
     * We expect a status update to come before (pollInterval + timeout).
     * Then we add 250ms to account for delays in networking.
     */
    var _getMonitorStatus = function (pingInfo: PingInfo) {
        var pollInterval = pingInfo.interval;
        var timeout = pingInfo.timeout;
        var latestPingTimeInMillis = pingInfo.latestPing.datetime;

        var timedOutLength = 3 * (pollInterval + timeout) + 250;
        var latestPingTime = new Date(latestPingTimeInMillis).getTime();
        var cuttOffTime = Date.now() - timedOutLength;

        return latestPingTime > cuttOffTime ? 'Online' : 'Offline';
    };

    /**
     * @description
     * Creates a real-time monitor of ping information supplied by a Firebase data source
     */
    angular.module('sla')
        .directive('liveMonitor', [
            '$firebaseObject',
            'firebaseUrl',
            '$interval',
            function ($firebaseObject, firebaseUrl, $interval) {
                return {
                    scope: {
                        configId: '@'
                    },
                    templateUrl: 'components/live-monitor/live-monitor.htm',
                    link: function (scope, iElement, iAttrs) {
                        if (typeof scope.configId === 'undefined') {
                            throw new Error('live-monitor: Missing required attribute "configId"');
                        }

                        var monitorRef = new Firebase(firebaseUrl + scope.configId);
                        var pingInfo = <PingInfo> $firebaseObject(monitorRef);
                        var latestPing = <LatestPing> $firebaseObject(monitorRef.child('latestPing'));
                        var updateStatus;

                        pingInfo.$loaded()
                            .then(function () {
                                scope.finishedLoadingConfig = true;

                                updateStatus = $interval(function () {
                                    scope.monitorStatus = _getMonitorStatus(pingInfo);
                                }, 250);
                            });

                        scope.finishedLoadingConfig = false;
                        scope.pingInfo = pingInfo;
                        scope.latestPing = latestPing;

                        iElement.on('$destory', function () {
                            $interval.cancel(updateStatus);
                        });
                    }
                };
            }
        ]);
}