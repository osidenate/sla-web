using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LatencyMonitorServices
{
    public class PingRequest
    {
        string host = "test host";
    }

    public class PingResponse : EventArgs
    {
        public string host = "test";
    }
}
