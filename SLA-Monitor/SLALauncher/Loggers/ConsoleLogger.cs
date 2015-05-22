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

        public ILogger SubscribeToMonitor(LatencyMonitor latencyMonitor)
        {
            latencyMonitor.PingSent += PrintSent;
            latencyMonitor.PingCompleted += OnPingCompleted;

            return this;
        }

        private void OnPingCompleted(PingReply reply)
        {
            switch (reply.Status)
            {
                case IPStatus.Success:
                    PrintSuccess(reply);
                    break;

                case IPStatus.TimedOut:
                    PrintTimeout(reply);
                    break;
            }
        }

        private void PrintSent(IPAddress pingSender)
        {
            Console.WriteLine();
            Console.WriteLine("Sending Ping to " + pingSender.ToString());
        }

        private void PrintSuccess(PingReply reply)
        {
            Console.WriteLine();
            Console.WriteLine("IP Address: " + reply.Address);
            Console.WriteLine("RoundTrip time: " + reply.RoundtripTime);
        }

        private void PrintTimeout(PingReply reply)
        {
            Console.WriteLine();
            Console.WriteLine("IP Address: " + reply.Address);
            Console.WriteLine("RoundTrip time: " + reply.RoundtripTime);
        }
    }
}
