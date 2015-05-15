using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using SLAServices;
using System.Net;

namespace SLALauncher
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

        static void Main(string[] args)
        {
            LoadConfig();

            var latencyMonitor = new LatencyMonitor(host, pollingInterval, timeout);
            var consoleLogger = new PingConsoleLogger(latencyMonitor);
            latencyMonitor.Start();

            Thread.Sleep(1250);
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
            }
            catch (FormatException)
            {
                Console.WriteLine("The IP Address supplied in the config file is not valid.");
                Environment.Exit(1);
            }
            firebaseHost = "Placeholder Firebase Host";
        }
    }
}
