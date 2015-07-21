## Overview
This project started as a way for me to measure the quality of my home internet connection. Specifically, I wanted to monitor the real-time status of my home server. 

There are three components to this system:
- **sla-monitor**: A .NET console application that measures & records latencies. This runs on my home server.
- **sla-web**: An AngularJS application that can display the latencies recorded by sla-monitor in real-time.
- **firebase**: Stores the configuration for sla-monitor and records the latest latencies.

![SLA Monitor Diagram](http://websocks.net/img/sla-monitor-diagram.png)

#### SLA Web Client Overview
The SLA Web Client is used to view real-time data concerning the SLA Monitor. This project can be ran as a stand-alone webapp or it's live-monitor component can be consumed by a client app using bower.

#### Setting up the SLA Web Client for Development
Install the npm dependencies:
`npm install`

Install the bower dependencies:
`bower install`

Load the typescript definitions:
`grunt setup`

Start the webserver:
`grunt server`

#### Packaging the sla-web
sla-web can be packaged into a library so that it's components can be consumed by another app. This is how the component is integrated into the `websocks.net` website.

Package the app: `grunt package`

