using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using LatencyMonitorServices;

namespace SLALauncher
{
    /// <summary>
    /// Launches the SLA Monitor using the default config found in App.config
    /// </summary>
    class Launcher
    {
        // Config for the PingProcessor
        private static string host;
        private static int pollingInterval;
        private static int timeout;

        // Config for Firebase
        private static string firebaseHost;

        static void Main(string[] args)
        {
            LoadConfig();

            var latencyMonitor = new LatencyMonitor(host, pollingInterval, timeout);
            latencyMonitor.Start();

            Console.WriteLine("Started SLA Monitor");
            Console.WriteLine("Host: " + host);

            Console.ReadLine();
        }

        private static void LoadConfig()
        {
            host = ConfigurationManager.AppSettings["DefaultHost"];
            pollingInterval = Int32.Parse(ConfigurationManager.AppSettings["DefaultPollingInterval"]);
            timeout = Int32.Parse(ConfigurationManager.AppSettings["DefaultTimeout"]);

            firebaseHost = "Placeholder Firebase Host";
        }
    }
}
