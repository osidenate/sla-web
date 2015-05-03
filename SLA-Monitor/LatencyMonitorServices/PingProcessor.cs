using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LatencyMonitorServices
{
    /// <summary>
    /// Sends a ping to a host and calculates the RTT
    /// </summary>
    class PingProcessor
    {
        public PingProcessor(PingRequest ping)
        {

        }

        /// <summary>
        /// Sends a ping synchrounously and waits Timeout ms for a reply
        /// </summary>
        public PingResponse Send()
        {
            return new PingResponse();
        }
    }
}
