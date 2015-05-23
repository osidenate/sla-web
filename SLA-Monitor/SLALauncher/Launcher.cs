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
    /// Launches the SLA Monitor using the default config found in App.config
    /// </summary>
    class Launcher
    {
        // Config for Firebase
        private static string firebaseHost;
        private static string firebaseSecret;
        private static bool useFirebaseConfig;

        private static List<LatencyMonitor> latencyMonitors;
        private static ConsoleLogger consoleLogger;
        private static FirebaseLogger firebaseLogger;

        static void Main(string[] args)
        {
            // Loads the firebase info from App.config 
            LoadAppConfig();

            // Gets the latency monitor configuration from Firebase
            LoadFirebaseLatencyMonitorConfig()
                .ContinueWith(task => 
                {
                    List<LatencyMonitorConfig> configs = task.Result;
                    latencyMonitors = GenerateLatencyMonitors(configs);

                    SubscribeLoggers();
                    StartLatencyMonitors();
                });

            Console.ReadLine();

            StopLatencyMonitors();
        }

        private static void LoadAppConfig()
        {
            firebaseHost = ConfigurationManager.AppSettings["FirebaseUri"];
            firebaseSecret = ConfigurationManager.AppSettings["FirebaseSecret"];
            useFirebaseConfig = Convert.ToBoolean(ConfigurationManager.AppSettings["UseFirebaseLatencyMonitorConfig"]);
        }

        /// <summary>
        /// Loads the LatencyMonitor configuration from firebase
        /// </summary>
        private static async Task<List<LatencyMonitorConfig>> LoadFirebaseLatencyMonitorConfig()
        {
            IFirebaseConfig config = new FirebaseConfig
            {
                BasePath = firebaseHost,
                AuthSecret = firebaseSecret
            };

            var client = new FirebaseClient(config);
            var response = await client.GetAsync("slaMonitorConfig");
            return response.ResultAs<List<LatencyMonitorConfig>>();
        }

        private static void SubscribeLoggers()
        {
            consoleLogger = new ConsoleLogger();
            firebaseLogger = new FirebaseLogger(firebaseHost, firebaseSecret);

            foreach (var monitor in latencyMonitors)
            {
                consoleLogger.SubscribeToMonitor(monitor);
                firebaseLogger.SubscribeToMonitor(monitor);
            }
        }

        private static List<LatencyMonitor> GenerateLatencyMonitors(List<LatencyMonitorConfig> configs)
        {
            var latencyMonitors = new List<LatencyMonitor>();

            foreach (var config in configs)
            {
                latencyMonitors.Add(new LatencyMonitor(config));
            }

            return latencyMonitors;
        }

        private static void StartLatencyMonitors()
        {
            latencyMonitors.ForEach(monitor => monitor.Start());
        }

        private static void StopLatencyMonitors()
        {
            latencyMonitors.ForEach(monitor => monitor.Stop());
        }
    }
}
