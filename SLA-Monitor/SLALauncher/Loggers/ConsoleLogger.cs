using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LatencyMonitorService.Loggers;
using System.Net.NetworkInformation;
using System.Net;

namespace LatencyMonitorService.Loggers
{
    /// <summary>
    /// Used for logging LatencyMonitor events to the console.
    /// </summary>
    internal class ConsoleLogger : ILogger
    {
        public ConsoleLogger() {}

        public void SubscribeToMonitor(LatencyMonitor latencyMonitor)
        {
            latencyMonitor.PingCompleted += OnPingCompleted;
        }

        private void OnPingCompleted(PingReply reply, string toDisplayName)
        {
            Console.WriteLine("Received Pong from " + reply.Address + ", RTT: " + reply.RoundtripTime + "ms.");
        }
    }
}
