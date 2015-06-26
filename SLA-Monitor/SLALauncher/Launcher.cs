using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using LatencyMonitorService.Loggers;
using System.Net;
using FireSharp.Config;
using FireSharp;

namespace LatencyMonitorService
{
    /// <summary>
    /// Loads the configuration information from Firebase and launches the LatencyMonitors
    /// </summary>
    class Launcher
    {
        private static string firebaseHost;
        private static string firebaseSecret;
        private static string fromDisplayName;

        private List<LatencyMonitor> latencyMonitors;
        private ConsoleLogger consoleLogger;
        private FirebaseLogger firebaseLogger;

        static void Main(string[] args)
        {
            // Loads the firebase info from App.config 
            firebaseHost = ConfigurationManager.AppSettings["FirebaseUri"];
            firebaseSecret = ConfigurationManager.AppSettings["FirebaseSecret"];
            fromDisplayName = ConfigurationManager.AppSettings["FromDisplayName"];

            Console.WriteLine("Starting Latency Monitor...");

            var slaLauncher = new Launcher();
            slaLauncher.Start();
            
            Console.ReadLine();
            slaLauncher.StopLatencyMonitors();
        }

        public void Start()
        {
            // Gets the latency monitor configuration from Firebase
            LoadFirebaseLatencyMonitorConfig()
                .ContinueWith(configTask =>
                {
                    List<LatencyMonitorConfig> configs = configTask.Result;
                    GenerateLatencyMonitors(configs);

                    SubscribeLoggers();
                    StartLatencyMonitors();
                });
        }

        /// <summary>
        /// Loads the LatencyMonitor configuration from firebase
        /// </summary>
        private async Task<List<LatencyMonitorConfig>> LoadFirebaseLatencyMonitorConfig()
        {
            IFirebaseConfig config = new FirebaseConfig
            {
                BasePath = firebaseHost,
                AuthSecret = firebaseSecret
            };

            var client = new FirebaseClient(config);
            var response = await client.GetAsync("/");
            return response.ResultAs<List<LatencyMonitorConfig>>();
        }

        private void GenerateLatencyMonitors(List<LatencyMonitorConfig> configs)
        {
            latencyMonitors = new List<LatencyMonitor>();

            foreach (var config in configs)
            {
                latencyMonitors.Add(new LatencyMonitor(config));
            }
        }
        
        private void SubscribeLoggers()
        {
            string serverAddress = Utility.GetPublicIP();

            Console.WriteLine("Pings will be logged from address: " + serverAddress);

            consoleLogger = new ConsoleLogger();
            firebaseLogger = new FirebaseLogger(firebaseHost, firebaseSecret, serverAddress, fromDisplayName);

            foreach (var monitor in latencyMonitors)
            {
                consoleLogger.SubscribeToMonitor(monitor);
                firebaseLogger.SubscribeToMonitor(monitor);
            }
        }

        private void StartLatencyMonitors()
        {
            latencyMonitors.ForEach(monitor => monitor.Start());
        }

        private void StopLatencyMonitors()
        {
            if (latencyMonitors != null)
            {
                latencyMonitors.ForEach(monitor => monitor.Stop());
            }
        }
    }
}
