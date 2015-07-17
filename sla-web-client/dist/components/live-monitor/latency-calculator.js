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
