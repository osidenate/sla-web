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
        public delegate void PingResponseHandler(PingReply response);
        public event PingSendHandler PingSent;
        public event PingResponseHandler PingCompleted;


        public bool IsMonitoring 
        { 
            get { return _pollingTimer.Enabled; } 
        }

        private readonly IPAddress _host;
        private readonly int _interval;
        private readonly int _timeout;
        private readonly Timer _pollingTimer;

        public LatencyMonitor(IPAddress host, int interval, int timeout)
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

            PingCompleted(response);
        }
    }
}
