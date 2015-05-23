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

        public FirebaseLogger(string firebaseUrl, string firebaseSecret, string fromIpAddress)
        {
            IFirebaseConfig config = new FirebaseConfig
            {
                BasePath = firebaseUrl,
                AuthSecret = firebaseSecret
            };

            _client = new FirebaseClient(config);
            this.fromIpAddress = fromIpAddress;
        }

        public void SubscribeToMonitor(LatencyMonitor latencyMonitor) 
        {
            latencyMonitor.PingCompleted += OnPingCompleted;
        }

        private async void OnPingCompleted(PingReply reply)
        {
            try
            {
                dynamic pingInfo = new
                {
                    fromIpAddress = this.fromIpAddress,
                    
                    // The IP Address that we just pinged
                    address = reply.Address.ToString(),

                    // Latency in milliseconds
                    rtt = reply.RoundtripTime,

                    // Status: Success / Timeout
                    status = reply.Status.ToString(),

                    // Outputs an ISO-8601 formatted date
                    datetime = DateTime.UtcNow.ToString("o"),

                    // This name will be shown on the GUI rather than the IP Address
                    // This is to prevent public clients from knowing the exact nodes we are monitoring
                    displayName = "Test Host"
                };

                PushResponse pushTest = await _client.PushAsync("pings", pingInfo);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Could not log ping to Firebase.");
                Console.WriteLine(ex);
            }
        }
    }
}
