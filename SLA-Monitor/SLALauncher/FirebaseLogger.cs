﻿using FireSharp;
using FireSharp.Config;
using FireSharp.Interfaces;
using FireSharp.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace LatencyMonitorService
{
    internal class FirebaseLogger
    {
        private readonly IFirebaseClient _client;

        public FirebaseLogger(LatencyMonitor latencyMonitor, string firebaseUrl, string firebaseSecret)
        {
            latencyMonitor.PingCompleted += OnPingCompleted;

            IFirebaseConfig config = new FirebaseConfig
            {
                BasePath = firebaseUrl,
                AuthSecret = firebaseSecret
            };

            _client = new FirebaseClient(config);
        }

        private void OnPingCompleted(PingReply reply)
        {

            switch (reply.Status)
            {
                case IPStatus.Success:
                    LogSuccess(reply);
                    break;

                case IPStatus.TimedOut:
                    LogTimeout(reply);
                    break;
            }

        }

        private async void LogSuccess(PingReply reply)
        {
            try
            {
                dynamic pingInfo = new
                {
                    address = reply.Address.ToString(),
                    rtt = reply.RoundtripTime,
                    status = reply.Status.ToString()
                };

                PushResponse pushTest = await _client.PushAsync("pings", pingInfo);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Could not log ping to Firebase.");
                Console.WriteLine(ex);
            }
        }

        private async void LogTimeout(PingReply reply)
        {
        }
    }
}
