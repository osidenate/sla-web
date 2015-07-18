/// <reference path="../typings/tsd.d.ts" />
var SLAClient;
(function (SLAClient) {
    angular.module('sla', ['firebase'])
        .constant('firebaseUrl', 'https://sla-monitor-dev.firebaseio.com/');
})(SLAClient || (SLAClient = {}));

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="latency-calculator.ts" />
var LiveMonitor;
(function (LiveMonitor) {
    var _DEFAULT_BUFFER_SIZE_ = 25;
    /**
     * @description
     * Determines the status of the Latency Monitor based on the latest ping's timestamp.
     * The monitor is considered offline if it missed three consecutive status updates.
     * We expect a status update to come before (pollInterval + timeout).
     * Then we add 250ms to account for delays in networking.
     */
    var _getMonitorStatus = function (pingInfo) {
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
                templateUrl: function (element, attr) {
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
                    var latencyCalc = new LiveMonitor.LatencyCalculator(bufferSize);
                    var monitorRef = new Firebase(firebaseUrl + scope.configId);
                    var pingInfo = $firebaseObject(monitorRef);
                    var latestPing = $firebaseObject(monitorRef.child('latestPing'));
                    var updateStatus;
                    pingInfo.$loaded()
                        .then(function () {
                        scope.finishedLoadingConfig = true;
                        updateStatus = $interval(function () {
                            scope.monitorStatus = _getMonitorStatus(pingInfo);
                        }, 250);
                    });
                    latestPing.$watch(function () {
                        if (latestPing.status === 'Success') {
                            latencyCalc.push(latestPing.rtt);
                        }
                    });
                    scope.finishedLoadingConfig = false;
                    scope.pingInfo = pingInfo;
                    scope.latestPing = latestPing;
                    scope.getAverageRtt = function () {
                        return latencyCalc.getMovingAverage();
                    };
                    scope.getJitter = function () {
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
})(LiveMonitor || (LiveMonitor = {}));

/// <reference path="../../typings/tsd.d.ts" />
var LiveMonitor;
(function (LiveMonitor) {
    // Translates the status returned from the server into the human readable version
    angular.module('sla')
        .filter('pingStatus', function () {
        return function (status) {
            if (status === 'Success') {
                return "Success";
            }
            if (status === 'TimedOut') {
                return "Timed Out";
            }
            return "---";
        };
    });
})(LiveMonitor || (LiveMonitor = {}));

/// <reference path="../../typings/tsd.d.ts" />
var LiveMonitor;
(function (LiveMonitor) {
    /**
     * @description
     * Stores the latest RTT's in a circular buffer.
     * Can calculate the exponential moving average of the pings in the buffer.
     */
    var LatencyCalculator = (function () {
        function LatencyCalculator(length) {
            this.buffer = [];
            this.maxLength = length;
            this.pointer = 0;
        }
        LatencyCalculator.prototype.push = function (pingRtt) {
            this.buffer[this.pointer] = pingRtt;
            this.pointer = (this.pointer + 1) % this.maxLength;
        };
        /**
         * @returns Calculates the exponential moving average of the latencies in the buffer
         */
        LatencyCalculator.prototype.getMovingAverage = function () {
            var buffer = this.buffer;
            var pointer = this.pointer;
            var length = this.buffer.length;
            // The sum of the number of items in buffer
            var total = (function () {
                return buffer.reduce(function (acc, curr, index) {
                    return (index + 1) + acc;
                }, 0);
            })();
            return buffer.reduce(function (accumulator, current, index) {
                var numerator = index - pointer;
                if (numerator < 0) {
                    numerator += length;
                }
                var weight = (numerator + 1) / total;
                return current * weight + accumulator;
            }, 0);
        };
        /**
         * @returns The difference of the maximum latency and minimum latencies
         */
        LatencyCalculator.prototype.getJitter = function () {
            if (this.buffer.length <= 1) {
                return 0;
            }
            var min = Math.min.apply(Math, this.buffer);
            var max = Math.max.apply(Math, this.buffer);
            return max - min;
        };
        return LatencyCalculator;
    })();
    LiveMonitor.LatencyCalculator = LatencyCalculator;
})(LiveMonitor || (LiveMonitor = {}));
