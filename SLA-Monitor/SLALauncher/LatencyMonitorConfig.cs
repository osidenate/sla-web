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
        public readonly int ConfigId;
        public readonly string Host;
        public readonly int Interval;
        public readonly int Timeout;
        public readonly string DisplayTo;
        public readonly string DisplayFrom;

        public IPAddress IPAddress
        {
            get
            {
                return IPAddress.Parse(Host);
            }
        }

        public LatencyMonitorConfig(int configId, string host, int interval, int timeout, string displayTo, string displayFrom)
        {
            this.ConfigId = configId;
            this.Host = host;
            this.Interval = interval;
            this.Timeout = timeout;
            this.DisplayTo = displayTo;
            this.DisplayFrom = displayFrom;
        }
    }
}
