using FuturisticPortfolio.Services;
using FuturisticPortfolio.Repositories;
using FuturisticPortfolio.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FuturisticPortfolio.Controllers
{
    [ApiController]
    [Route("api")]
    public class ApiController : ControllerBase
    {
        private readonly IPortfolioAIService _aiService;
        private readonly IUnitOfWork _unitOfWork;

        public ApiController(IPortfolioAIService aiService, IUnitOfWork unitOfWork)
        {
            _aiService = aiService;
            _unitOfWork = unitOfWork;
        }

        [HttpPost("ai/chat")]
        public async Task<IActionResult> AIChat([FromBody] ChatRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { error = "Message cannot be empty." });
            }

            try
            {
                var response = await _aiService.GetAIResponseAsync(request.Message);
                return Ok(new { reply = response });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "AI agent is temporarily offline." });
            }
        }

        [HttpPost("telemetry/log-interest")]
        public async Task<IActionResult> LogInterest([FromBody] TelemetryRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.ElementName))
            {
                return BadRequest(new { error = "Invalid telemetry packet." });
            }

            try
            {
                var ip = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown IP";
                if (ip == "::1") ip = "127.0.0.1";

                var log = new ActivityLog
                {
                    Action = "User Interest",
                    Details = $"Visitor clicked {request.ElementType}: '{request.ElementName}'",
                    IpAddress = ip,
                    Timestamp = DateTime.UtcNow
                };

                await _unitOfWork.ActivityLogs.AddAsync(log);
                await _unitOfWork.CompleteAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Telemetry logging failure: " + ex.Message });
            }
        }

        [HttpPost("telemetry/update-visitor")]
        public async Task<IActionResult> UpdateVisitor([FromBody] UpdateVisitorRequest request)
        {
            if (request == null || request.VisitorId <= 0)
            {
                return BadRequest(new { error = "Invalid visitor parameter." });
            }

            try
            {
                var visitor = await _unitOfWork.Visitors.GetByIdAsync(request.VisitorId);
                if (visitor != null)
                {
                    visitor.Country = request.Country;
                    await _unitOfWork.CompleteAsync();
                }
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to update visitor: " + ex.Message });
            }
        }

        [HttpPost("telemetry/update-duration")]
        public async Task<IActionResult> UpdateDuration([FromBody] UpdateDurationRequest request)
        {
            if (request == null || request.VisitorId <= 0)
            {
                return BadRequest(new { error = "Invalid duration parameters." });
            }

            try
            {
                var visitor = await _unitOfWork.Visitors.GetByIdAsync(request.VisitorId);
                if (visitor != null)
                {
                    visitor.TimeSpentSeconds = request.Seconds;
                    await _unitOfWork.CompleteAsync();
                }
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to update visitor duration: " + ex.Message });
            }
        }
    }

    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
    }

    public class TelemetryRequest
    {
        public string ElementType { get; set; } = string.Empty;
        public string ElementName { get; set; } = string.Empty;
    }

    public class UpdateVisitorRequest
    {
        public int VisitorId { get; set; }
        public string Country { get; set; } = string.Empty;
    }

    public class UpdateDurationRequest
    {
        public int VisitorId { get; set; }
        public int Seconds { get; set; }
    }
}
