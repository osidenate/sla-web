using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LatencyMonitor
{
    class Program
    {
        static void Main(string[] args)
        {
            var pingProcessor = new PingProcessor();
            pingProcessor.Start();

            var defaultHost = ConfigurationManager.AppSettings["DefaultHost"];
            Console.WriteLine("Host: " + defaultHost);

            Console.ReadLine();
        }
    }
}
