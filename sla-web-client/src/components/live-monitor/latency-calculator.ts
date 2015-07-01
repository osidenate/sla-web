module LiveMonitor {

    /**
     * Stores the latest RTT's in a circular buffer.
     * Calculates the moving average of the pings.
     */

    export class LatencyCalculator {
        private pointer: number;
        private maxLength: number;
        private buffer: number[];

        constructor (length: number) {
            this.buffer = new Array(length);
            this.maxLength = length;
            this.pointer = 0;
        }

        push (pingRtt: number): void {
            this.buffer[this.pointer] = pingRtt;
            this.pointer = (this.pointer + 1) % this.maxLength;
        }

        //getMovingAverage (): number {
        //    var buffer = this.buffer;
        //    var pointer = this.pointer;
        //    var maxLength = this.maxLength;
        //
        //    return buffer.reduce(function(accumulator, current, index) {
        //        var distanceFromHead: number;
        //
        //        if (index < pointer) {
        //            distanceFromHead = (pointer - 1) - index;
        //        }
        //        else {
        //            distanceFromHead = maxLength + pointer - index;
        //        }
        //
        //        console.info('value: ' + current + ', dist: ' + distanceFromHead);
        //
        //        return 0;
        //    });
        //}
    }
}
