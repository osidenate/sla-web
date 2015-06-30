/// <reference path="../../typings/tsd.d.ts" />

angular.module('sla')

    // Translates the status returned from the server into the human readable version
    .filter('pingStatus', function() {
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
