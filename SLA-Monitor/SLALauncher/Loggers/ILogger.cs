using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LatencyMonitorService.Loggers
{
    internal interface ILogger
    {
        void SubscribeToMonitor(LatencyMonitor monitor);
    }
}
