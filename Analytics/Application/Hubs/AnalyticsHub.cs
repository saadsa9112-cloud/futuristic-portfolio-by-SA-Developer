using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace FuturisticPortfolio.Analytics.Application.Hubs
{
    public class AnalyticsHub : Hub
    {
        private static int _activeConnections = 0;

        public static int ActiveConnections => _activeConnections;

        public override async Task OnConnectedAsync()
        {
            Interlocked.Increment(ref _activeConnections);
            
            // Broadcast connection count update to dashboard users
            await Clients.All.SendAsync("ActiveDashboardUsersChanged", _activeConnections);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Interlocked.Decrement(ref _activeConnections);
            await Clients.All.SendAsync("ActiveDashboardUsersChanged", _activeConnections);
            await base.OnDisconnectedAsync(exception);
        }

        // Methods to notify dashboard clients from backend triggers
        public async Task SendLiveUpdate(object data)
        {
            await Clients.All.SendAsync("ReceiveLiveAnalytics", data);
        }

        public async Task SendAlert(string alertType, string message)
        {
            await Clients.All.SendAsync("ReceiveAnalyticsAlert", new { Type = alertType, Message = message, Timestamp = DateTime.UtcNow });
        }
    }
}
