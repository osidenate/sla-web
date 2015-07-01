'use strict';

describe('Latency Calculator', function() {
    var LatencyCalculator = LiveMonitor.LatencyCalculator;
    var latencyCalc;

    it('should be able to remember the most recent latencies', function() {
        latencyCalc = new LatencyCalculator(3);

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

    it('should be able to calculate the exponential moving average of the most recent latencies', function() {
        latencyCalc = new LatencyCalculator(3);

        // 100*(1/1) == 100
        latencyCalc.push(100);
        expect(latencyCalc.getMovingAverage()).toEqual(100);

        // 100*(1/3) + 50*(2/3) == 66.6666
        latencyCalc.push(50);
        expect(latencyCalc.getMovingAverage()).toEqual(66 + (2/3));

        // 100*(1/6) + 50*(2/6) + 150*(3/6) == 108.3333
        latencyCalc.push(150);
        expect(latencyCalc.getMovingAverage()).toEqual(108 + (2/3));

        // 50*(1/6) + 150*(2/6) + 25*(3/6) == 70.8333
        latencyCalc.push(25);
        expect(latencyCalc.getMovingAverage()).toEqual(70 + (5/6));
    });
});
