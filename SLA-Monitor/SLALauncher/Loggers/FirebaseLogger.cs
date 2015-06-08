using FireSharp;
using FireSharp.Config;
using FireSharp.Interfaces;
using FireSharp.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace LatencyMonitorService.Loggers
{
    /// <summary>
    /// Used for logging LatencyMonitor events to Firebase
    /// </summary>
    internal class FirebaseLogger : ILogger
    {
        private readonly IFirebaseClient _client;
        private readonly string fromIpAddress;
        private readonly string fromDisplayName;

        public FirebaseLogger(string firebaseUrl, string firebaseSecret, string fromIpAddress, string fromDisplayName)
        {
            this.fromIpAddress = fromIpAddress;
            this.fromDisplayName = fromDisplayName;

            IFirebaseConfig config = new FirebaseConfig
            {
                BasePath = firebaseUrl,
                AuthSecret = firebaseSecret
            };

            _client = new FirebaseClient(config);
        }

        public void SubscribeToMonitor(LatencyMonitor latencyMonitor) 
        {
            latencyMonitor.PingCompleted += OnPingCompleted;
        }

        private async void OnPingCompleted(PingReply reply, string toDisplayName)
        {
            try
            {
                dynamic pingInfo = new
                {
                    // Public IP Address of the server the latency monitor is on
                    fromIpAddress = this.fromIpAddress,
                    
                    // The IP Address that we just pinged
                    toIpAddress = reply.Address.ToString(),

                    // Latency in milliseconds
                    rtt = reply.RoundtripTime,

                    // Status: Success / Timeout
                    status = reply.Status.ToString(),

                    // Outputs an ISO-8601 formatted date
                    datetime = DateTime.UtcNow.ToString("o"),

                    fromDisplayName = this.fromDisplayName,

                    toDisplayName = toDisplayName
                };

                string zone = Utility.GetCurrentZoneName();

                PushResponse pushTest = await _client.PushAsync("pings/" + zone, pingInfo);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Could not log ping to Firebase.");
                Console.WriteLine(ex);
            }
        }
    }
}
