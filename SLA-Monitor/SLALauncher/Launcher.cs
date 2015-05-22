using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using LatencyMonitorService.Loggers;
using System.Net;

namespace LatencyMonitorService
{
    /// <summary>
    /// Launches the SLA Monitor using the default config found in App.config
    /// </summary>
    class Launcher
    {
        // Config for the PingProcessor
        private static IPAddress host;
        private static int pollingInterval;
        private static int timeout;

        // Config for Firebase
        private static string firebaseHost;
        private static string firebaseSecret;

        static void Main(string[] args)
        {
            LoadConfig();

            // TODO Load latency monitors & configuration from firebase so that it can be configured by the client app

            var latencyMonitor = new LatencyMonitor(host, pollingInterval, timeout, "Test Host");
            var latencyMonitor2 = new LatencyMonitor(IPAddress.Parse("4.2.2.1"), pollingInterval + 25, timeout, "Test Host 2");

            new ConsoleLogger()
                .SubscribeToMonitor(latencyMonitor)
                .SubscribeToMonitor(latencyMonitor2);

            new FirebaseLogger(firebaseHost, firebaseSecret)
                .SubscribeToMonitor(latencyMonitor)
                .SubscribeToMonitor(latencyMonitor2);

            latencyMonitor.Start();
            latencyMonitor2.Start();

            Thread.Sleep(8500);
            latencyMonitor.Stop();
            latencyMonitor2.Stop();

            Console.ReadLine();
        }

        private static void LoadConfig()
        {
            try
            {
                host = IPAddress.Parse(ConfigurationManager.AppSettings["DefaultHost"]);
                pollingInterval = Int32.Parse(ConfigurationManager.AppSettings["DefaultPollingInterval"]);
                timeout = Int32.Parse(ConfigurationManager.AppSettings["DefaultTimeout"]);

                firebaseHost = ConfigurationManager.AppSettings["FirebaseUri"];
                firebaseSecret = ConfigurationManager.AppSettings["FirebaseSecret"];
            }
            catch (FormatException)
            {
                Console.WriteLine("The IP Address supplied in the config file is not valid.");
                Environment.Exit(1);
            }
        }
    }
}
