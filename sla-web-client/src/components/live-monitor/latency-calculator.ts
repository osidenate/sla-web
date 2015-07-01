module LiveMonitor {

    /**
     * @description
     * Stores the latest RTT's in a circular buffer.
     * Can calculate the exponential moving average of the pings in the buffer.
     */
    export class LatencyCalculator {
        private pointer: number;
        private maxLength: number;
        private buffer: number[];

        constructor (length: number) {
            this.buffer = [];
            this.maxLength = length;
            this.pointer = 0;
        }

        push (pingRtt: number): void {
            this.buffer[this.pointer] = pingRtt;
            this.pointer = (this.pointer + 1) % this.maxLength;
        }

        /**
         * @returns The exponential moving average of the latencies in the buffer
         */
        getMovingAverage (): number {
            var buffer = this.buffer;
            var pointer = this.pointer;
            var length = this.buffer.length;

            // The sum of the number of items in buffer
            var total = (function() {
                return buffer.reduce(function(acc, curr, index) {
                    return (index + 1) + acc;
                }, 0);
            })();

            return buffer.reduce(function(accumulator, current, index) {
                var numerator = index - pointer;

                if (numerator < 0) {
                    numerator += length;
                }

                var weight = (numerator + 1) / total;

                return current * weight + accumulator;
            }, 0);
        }
    }
}
