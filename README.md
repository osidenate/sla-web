## Overview
This project started as a way for me to measure the quality of my home internet connection. 
I wanted to monitor the latency between my home server and other computers in real-time.

This part of the system, sla-web, is an AngularJS webapp. 
It connects with Firebase in order to retrieve the latency information in real-time.
In order for this webapp to display useful information, sla-monitor needs to be running on the host that we want to monitor.

There are three components to this system:
- **sla-monitor**: A .NET console application that measures & records latencies. This runs on my home server.
- **sla-web**: An AngularJS application that can display the latencies recorded by sla-monitor in real-time.
- **firebase**: Stores the configuration for sla-monitor and records the latest latencies.

![SLA Monitor Diagram](http://websocks.net/img/sla-monitor-diagram.png)


#### Technologies Used
Part of the reason I created this project was to become more familiar with some of the latest front-end tools.
This project is developed using TypeScript instead of JavaScript.
The TypeScript is then transpiled into JavaScript using Grunt.
See below for more information about the build process or just checkout `Gruntfile.js` to see exactly what's going on.

Karma and Jasmine are used for unit testing some of the more complex parts of the app.
For example, we unit test calculating the exponential moving average of recent latencies.

#### Setting up the SLA Web Client for Development
Get the Source:
`git clone https://github.com/osidenate/sla-web.git`

Install the npm dependencies:
`npm install`

Install the bower dependencies:
`bower install`

Load the typescript definitions:
`grunt setup`

Start the webserver:
`grunt server`

#### Packaging sla-web
`sla-web` can be packaged into a library so that it's components can be consumed by another app.

Package the app by using: `grunt package`
