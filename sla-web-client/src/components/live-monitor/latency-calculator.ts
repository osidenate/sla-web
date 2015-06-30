module LiveMonitor {

    /**
     * Stores the latest RTT's in a circular buffer.
     * Calculates the moving average of the pings.
     */
    class LatencyCalculator {
        private pointer: number;
        private maxLength: number;
        private buffer: number[];

        constructor (length: number) {
            this.maxLength = length;
            this.pointer = 0;
        }

        push (pingRtt: number) {
            this.buffer[this.pointer] = pingRtt;
            this.pointer = (this.pointer + 1) % this.maxLength;
        }

        print () {
            this.buffer.forEach(function(ele) {
                console.log(ele);
            });
        }
    }
}
