/// <reference path="../../typings/tsd.d.ts" />

module LiveMonitor {
    // Translates the status returned from the server into the human readable version
    angular.module('sla')
        .filter('pingStatus', () => {
            return status => {
                if (status === 'Success') {
                    return "Success";
                }
                if (status === 'TimedOut') {
                    return "Timed Out";
                }

                return "---";
            };
        });
}
