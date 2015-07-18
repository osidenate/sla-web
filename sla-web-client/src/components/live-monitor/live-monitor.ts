/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="latency-calculator.ts" />

module LiveMonitor {
    const _DEFAULT_BUFFER_SIZE_: number = 25;

    interface PingInfo extends AngularFireObject {
        configId: number,
        displayFrom: string,
        displayTo: string,
        host: string,
        interval: number,
        latestPing: LatestPing,
        timeout: number,
    }

    interface LatestPing extends AngularFireObject {
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
     * Creates a real-time monitor of ping information supplied by a Firebase data source
     * @param {number} configId - Allows us to specify which latency monitor to use
     * @param {number} bufferSize - Allows us to specify how many pings to store in the latency calculator's buffer
     */
    angular.module('sla')
        .directive('liveMonitor', [
            '$firebaseObject',
            'firebaseUrl',
            '$interval',
            function ($firebaseObject, firebaseUrl, $interval) {
                return {
                    scope: {
                        configId: '@',
                        bufferSize: '@',
                        templateUrl: '@',
                    },
                    templateUrl: function(element, attr) {
                        if (!attr.templateUrl) {
                            throw "liveMonitor: Directive is missing the required attribute 'templateUrl'";
                        }
                        return attr.templateUrl;
                    },
                    link: function (scope, iElement, iAttrs) {
                        if (typeof scope.configId === 'undefined') {
                            throw new Error('live-monitor: Missing required attribute "configId"');
                        }

                        var bufferSize = scope.bufferSize || _DEFAULT_BUFFER_SIZE_;
                        var latencyCalc = new LatencyCalculator(bufferSize);
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

                        latestPing.$watch(function() {
                            if (latestPing.status === 'Success') {
                                latencyCalc.push(latestPing.rtt);
                            }
                        });

                        scope.finishedLoadingConfig = false;
                        scope.pingInfo = pingInfo;
                        scope.latestPing = latestPing;
                        scope.getAverageRtt = function() {
                            return latencyCalc.getMovingAverage();
                        };
                        scope.getJitter = function() {
                            return latencyCalc.getJitter();
                        };

                        iElement.on('$destory', function () {
                            $interval.cancel(updateStatus);
                            latestPing.$destroy();
                            pingInfo.$destroy();
                        });
                    }
                };
            }
        ]);
}
