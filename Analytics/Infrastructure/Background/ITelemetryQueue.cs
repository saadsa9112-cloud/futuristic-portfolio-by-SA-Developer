using System.Threading.Tasks;
using FuturisticPortfolio.Analytics.Application.Models;

namespace FuturisticPortfolio.Analytics.Infrastructure.Background
{
    public interface ITelemetryQueue
    {
        bool Enqueue(TelemetryPayload payload);
        ValueTask<TelemetryPayload> DequeueAsync(System.Threading.CancellationToken cancellationToken);
        int GetSize();
    }
}
