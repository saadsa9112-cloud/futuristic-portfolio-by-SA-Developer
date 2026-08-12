using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using FuturisticPortfolio.Analytics.Application.Models;

namespace FuturisticPortfolio.Analytics.Infrastructure.Background
{
    public class TelemetryQueue : ITelemetryQueue
    {
        private readonly Channel<TelemetryPayload> _channel;

        public TelemetryQueue()
        {
            // Set bounded channel capacity to prevent out-of-memory under extreme spikes
            var options = new BoundedChannelOptions(AnalyticsMetrics.Capacity)
            {
                FullMode = BoundedChannelFullMode.DropWrite // Drop new items if queue overflowing (safeguard)
            };
            
            _channel = Channel.CreateBounded<TelemetryPayload>(options);
        }

        public bool Enqueue(TelemetryPayload payload)
        {
            var success = _channel.Writer.TryWrite(payload);
            if (success)
            {
                AnalyticsMetrics.QueueSize = GetSize();
            }
            else
            {
                AnalyticsMetrics.DroppedEvents++;
            }
            return success;
        }

        public ValueTask<TelemetryPayload> DequeueAsync(CancellationToken cancellationToken)
        {
            var result = _channel.Reader.ReadAsync(cancellationToken);
            AnalyticsMetrics.QueueSize = GetSize();
            return result;
        }

        public int GetSize()
        {
            // Bounded channels have Count available on reader in newer .NET versions
            return _channel.Reader.Count;
        }
    }
}
