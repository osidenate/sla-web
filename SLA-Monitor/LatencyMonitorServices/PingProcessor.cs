using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace LatencyMonitorServices
{
    /// <summary>
    /// Sends a ping to a host and calculates the RTT
    /// </summary>
    class PingProcessor
    {
        private readonly IPAddress host;
        private readonly int timeout;

        public PingProcessor(IPAddress host, int timeout)
        {
            this.host = host;
            this.timeout = timeout;
        }

        /// <summary>
        /// Sends a ping synchrounously and waits Timeout ms for a reply
        /// </summary>
        public PingReply Send()
        {
            return new Ping().Send(host, timeout);
        }
    }
}
