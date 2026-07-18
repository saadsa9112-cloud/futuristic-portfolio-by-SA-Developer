namespace FuturisticPortfolio.Services
{
    public interface IPortfolioAIService
    {
        Task<string> GetAIResponseAsync(string userMessage);
    }
}
