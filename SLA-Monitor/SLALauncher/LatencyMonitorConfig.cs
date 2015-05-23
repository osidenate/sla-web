using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace LatencyMonitorService.Loggers
{
    public class LatencyMonitorConfig
    {
        public readonly string Host;
        public readonly int Interval;
        public readonly int Timeout;
        public readonly string DisplayName;

        public IPAddress IPAddress
        {
            get
            {
                return IPAddress.Parse(Host);
            }
        }

        public LatencyMonitorConfig(string host, int pollingInterval, int timeout, string displayName)
        {
            this.Host = host;
            this.Interval = pollingInterval;
            this.Timeout = timeout;
            this.DisplayName = displayName;
        }
    }
}
