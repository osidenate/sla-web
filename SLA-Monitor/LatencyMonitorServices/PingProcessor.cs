using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LatencyMonitorServices
{
    public delegate void PingResponseHandler(PingResponse response);
    public delegate void PingTimeoutHandler(PingResponse response);

    /// <summary>
    /// Sends pings to hosts and calculates the RTT. Notifies listeners when a ping returns or times out.
    /// </summary>
    class PingProcessor
    {
        public event PingResponseHandler Received;
        public event PingTimeoutHandler Timedout;
    }

    struct PingResponse
    {
        string host;
    }
}
