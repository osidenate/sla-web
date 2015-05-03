using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LatencyMonitorServices
{
    /// <summary>
    /// Manages when pings are sent out to hosts.
    /// Subscribers can be notified when a ping returns or times out.
    /// </summary>
    public class LatencyMonitor
    {
        public delegate void PingResponseHandler(object sender, PingResponse response);
        public delegate void PingTimeoutHandler(object sender, PingResponse response);

        public event PingResponseHandler Received;
        public event PingTimeoutHandler Timedout;

        public LatencyMonitor(string host, int interval, int timeout)
        {

        }

        /// <summary>
        /// Launches the latency monitoring on a new thread. Throws an exception if the LatencyMonitor is already running.
        /// </summary>
        public void Start()
        {
            // TODO We will create a loop here that sends a ping every Interval
            // When the task comes back with the PingResponse, we will notify the listeners (Console output and Database log)

            var pingProcessor = new PingProcessor(new PingRequest());

            Task<PingResponse> pingTask = Task.Run<PingResponse>(() => pingProcessor.Send());
            pingTask.ContinueWith((pingResponse) =>
            {
                Console.WriteLine("Notifying event handlers that a ping response was received...");
            });
        }

        public void Stop()
        {

        }
    }
}
