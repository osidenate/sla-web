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
    let _getMonitorStatus = (pingInfo: PingInfo) => {
        let pollInterval = pingInfo.interval;
        let timeout = pingInfo.timeout;
        let latestPingTimeInMillis = pingInfo.latestPing.datetime;

        let timedOutLength = 3 * (pollInterval + timeout) + 250;
        let latestPingTime = new Date(latestPingTimeInMillis).getTime();
        let cuttOffTime = Date.now() - timedOutLength;

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
            ($firebaseObject, firebaseUrl, $interval) => {
                return {
                    scope: {
                        configId: '@',
                        bufferSize: '@',
                        templateUrl: '@',
                    },
                    templateUrl: (element, attr) => {
                        if (!attr.templateUrl) {
                            throw "liveMonitor: Directive is missing the required attribute 'templateUrl'";
                        }
                        return attr.templateUrl;
                    },
                    link: (scope, iElement, iAttrs) => {
                        if (typeof scope.configId === 'undefined') {
                            throw new Error('live-monitor: Missing required attribute "configId"');
                        }

                        let bufferSize = scope.bufferSize || _DEFAULT_BUFFER_SIZE_;
                        let latencyCalc = new LatencyCalculator(bufferSize);
                        let monitorRef = new Firebase(firebaseUrl + scope.configId);
                        let pingInfo = <PingInfo> $firebaseObject(monitorRef);
                        let latestPing = <LatestPing> $firebaseObject(monitorRef.child('latestPing'));
                        let updateStatus;

                        pingInfo.$loaded().then(() => {
                            scope.finishedLoadingConfig = true;

                            updateStatus = $interval(() => {
                                scope.monitorStatus = _getMonitorStatus(pingInfo);
                            }, 250);
                        });

                        latestPing.$watch(() => {
                            if (latestPing.status === 'Success') {
                                latencyCalc.push(latestPing.rtt);
                            }
                        });

                        scope.finishedLoadingConfig = false;
                        scope.pingInfo = pingInfo;
                        scope.latestPing = latestPing;
                        scope.getAverageRtt = () => latencyCalc.getMovingAverage();
                        scope.getJitter = () => latencyCalc.getJitter();

                        iElement.on('$destory', () => {
                            $interval.cancel(updateStatus);
                            latestPing.$destroy();
                            pingInfo.$destroy();
                        });
                    }
                };
            }
        ]);
}
