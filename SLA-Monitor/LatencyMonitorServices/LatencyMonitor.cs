using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

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

        public bool IsMonitoring 
        { 
            get { return _pollingTimer.Enabled; } 
        }

        private readonly string _host;
        private readonly int _interval;
        private readonly int _timeout;
        private readonly Timer _pollingTimer;

        public LatencyMonitor(string host, int interval, int timeout)
        {
            _host = host;
            _interval = interval;
            _timeout = timeout;

            _pollingTimer = new Timer(_interval);
            _pollingTimer.Elapsed += OnPingInterval;
        }

        /// <summary>
        /// Launches the latency monitoring on a new thread. Throws an exception if the LatencyMonitor is already running.
        /// </summary>
        public void Start()
        {
            _pollingTimer.Enabled = true;
        }

        public void Stop()
        {
            _pollingTimer.Enabled = false;
        }

        /// <summary>
        /// Occurs every _interval if the LatencyMonitor is running. Informs the PingProcessor to send a ping to _host.
        /// </summary>
        protected void OnPingInterval(object sender, ElapsedEventArgs args)
        {
            Console.WriteLine("Sending Ping...");

            //var pingProcessor = new PingProcessor(new PingRequest());

            //Task<PingResponse> pingTask = Task.Run<PingResponse>(() => pingProcessor.Send());
            //pingTask.ContinueWith((pingResponse) =>
            //{
            //    Console.WriteLine("Notifying event handlers that a ping response was received...");
            //});

            // When the task comes back with the PingResponse, we will notify the listeners (Console output and Database log)
        }
    }
}
