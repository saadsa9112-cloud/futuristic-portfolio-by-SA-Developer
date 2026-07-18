namespace FuturisticPortfolio.Services
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string subFolder);
        void DeleteFile(string relativeFilePath);
    }
}
