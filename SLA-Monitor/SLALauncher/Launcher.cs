using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using LatencyMonitorService;
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

            var latencyMonitor = new LatencyMonitor(host, pollingInterval, timeout);
            var consoleLogger = new ConsoleLogger(latencyMonitor);
            var firebaseLogger = new FirebaseLogger(latencyMonitor, firebaseHost, firebaseSecret);
            latencyMonitor.Start();

            Thread.Sleep(8500);
            latencyMonitor.Stop();

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
