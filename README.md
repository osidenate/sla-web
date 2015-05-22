## Overview
SLA Monitor is a network quality monitoring system. 
Right now, it only supports monitoring latency.
It may support other monitoring types in the future (like bandwidth).
In the future, I would like to have this service running on a few nodes in 
different geographic locations and different ISPs.
With enough data, over time, we can create a database of the quality of different ISPs.

## SLA Service
The SLA service is used to monitor the latency between the a computer and other nodes.
It is a .NET Console application that loads it's configuration from Firebase
and logs the latency information to Firebase.

### Initial Firebase Setup
The latency monitor configuration should be stored in the specified format. To get started quickly,
import this JSON directly into a new Firebase App. This will setup the latency monitors to target
Google's DNS servers and Level 3.

    {
      "sla-monitor-config" : [ {
        "displayName" : "Google DNS",
        "host" : "8.8.8.8",
        "interval" : 4000,
        "timeout" : 3000
      }, {
        "displayName" : "Level 3 DNS",
        "host" : "4.2.2.1",
        "interval" : 4000,
        "timeout" : 3000
      } ]
    }
    


