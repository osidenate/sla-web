'use strict';

describe('Latency Calculator', function() {
    var LatencyCalculator = LiveMonitor.LatencyCalculator;
    var latencyCalc;

    it('should be able to remember the most recent latencies in a circular buffer', function() {
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

    it('should be able to calculate the exponential moving average', function() {
        latencyCalc = new LatencyCalculator(3);

        expect(latencyCalc.getMovingAverage()).toEqual(0);

        // 100*(1/1) == 100
        latencyCalc.push(100);
        expect(latencyCalc.getMovingAverage()).toEqual(100);

        // 100*(1/3) + 50*(2/3) == 66.6666...
        latencyCalc.push(50);
        expect(latencyCalc.getMovingAverage()).toEqual(66.66666666666666);

        // 100*(1/6) + 50*(2/6) + 150*(3/6) == 108.3333...
        latencyCalc.push(150);
        expect(latencyCalc.getMovingAverage()).toEqual(108.33333333333333);

        // 50*(1/6) + 150*(2/6) + 25*(3/6) == 70.8333...
        latencyCalc.push(25);
        expect(latencyCalc.getMovingAverage()).toEqual(70.83333333333333);

        // 150*(1/6) + 25*(2/6) + 1000*(3/6) == 533.3333...
        latencyCalc.push(1000);
        expect(latencyCalc.getMovingAverage()).toEqual(533.3333333333333);
    });

    /**
     * Jitter should be the MAX - MIN latency in the Latency Calculator buffer
     */
    it('should be able to calculate the jitter', function() {
        latencyCalc = new LatencyCalculator(10);

        // Defined to be 0
        expect(latencyCalc.getJitter()).toEqual(0);

        // 10 - 10 = 0
        latencyCalc.push(10);
        expect(latencyCalc.getJitter()).toEqual(0);

        // 15 - 10 = 5
        latencyCalc.push(15);
        expect(latencyCalc.getJitter()).toEqual(5);

        // 20 - 10 = 10
        latencyCalc.push(20);
        expect(latencyCalc.getJitter()).toEqual(10);

        // 20 - 10 = 10
        latencyCalc.push(15);
        expect(latencyCalc.getJitter()).toEqual(10);

        // 20 - 5 = 15
        latencyCalc.push(5);
        expect(latencyCalc.getJitter()).toEqual(15);

        // 25 - 5 = 20
        latencyCalc.push(25);
        expect(latencyCalc.getJitter()).toEqual(20);
    });
});
