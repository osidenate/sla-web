using LatencyMonitorService.Loggers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace LatencyMonitorService
{
    /// <summary>
    /// Manages when pings are sent out to hosts.
    /// Subscribers can be notified when a ping returns or times out.
    /// </summary>
    public class LatencyMonitor
    {
        public delegate void PingSendHandler(IPAddress host);
        public delegate void PingResponseHandler(int configId, PingReply response);
        public event PingSendHandler PingSent;
        public event PingResponseHandler PingCompleted;

        public bool IsMonitoring 
        { 
            get { return _pollingTimer.Enabled; } 
        }

        private readonly int _configId;
        private readonly IPAddress _host;
        private readonly int _interval;
        private readonly int _timeout;
        private readonly Timer _pollingTimer;
        private readonly string _toDisplayName;

        public LatencyMonitor(LatencyMonitorConfig config)
        {
            _configId = config.ConfigId;
            _host = config.IPAddress;
            _interval = config.Interval;
            _timeout = config.Timeout;
            _toDisplayName = config.DisplayTo;

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
            var ping = new Ping();
            ping.PingCompleted += new PingCompletedEventHandler(OnPingCompleted);
            ping.SendAsync(_host, _timeout);
            
            PingSent(_host);
        }

        protected void OnPingCompleted(object sender, PingCompletedEventArgs e)
        {
            PingReply response = e.Reply;

            if (e.Error != null)
            {
                Console.WriteLine("Ping failed:");
                Console.WriteLine(e.Error.ToString());
                return;
            }

            PingCompleted(_configId, response);
        }
    }
}
