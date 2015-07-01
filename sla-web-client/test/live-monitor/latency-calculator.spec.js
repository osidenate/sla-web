'use strict';

describe('Latency Calculator', function() {
    var latencyCalc;

    afterEach(function() {
        latencyCalc = null;
    });

    it('should be able to remember the most recent latencies', function() {
        latencyCalc = new LiveMonitor.LatencyCalculator(3);

        // The buffer should be full after these latencies are added
        latencyCalc.push(0);
        latencyCalc.push(50.2);
        latencyCalc.push(10000);
        expect(latencyCalc.buffer).toEqual([0, 50.2, 10000]);
        expect(latencyCalc.pointer).toEqual(0);

        // The circular buffer should begin to overwrite items when these latencies are added
        latencyCalc.push(35);
        latencyCalc.push(20);
        expect(latencyCalc.buffer).toEqual([35, 20, 10000]);
        expect(latencyCalc.pointer).toEqual(2);
    });
});
