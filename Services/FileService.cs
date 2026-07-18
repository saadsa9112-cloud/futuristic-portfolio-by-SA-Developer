namespace FuturisticPortfolio.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string subFolder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            // 1. File validation rules
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf", ".mp4", ".ico" };
            if (!allowedExtensions.Contains(extension))
            {
                throw new InvalidOperationException("Unsupported file format.");
            }

            // Limit image/pdf file sizes (e.g., 10MB)
            if (extension != ".mp4" && file.Length > 10 * 1024 * 1024)
            {
                throw new InvalidOperationException("File size exceeds 10MB limit.");
            }
            // Limit video file sizes (e.g., 50MB)
            if (extension == ".mp4" && file.Length > 50 * 1024 * 1024)
            {
                throw new InvalidOperationException("Video file size exceeds 50MB limit.");
            }

            // 2. Setup path
            var uploadFolder = Path.Combine(_environment.WebRootPath, "uploads", subFolder);
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            // 3. Generate unique filename
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadFolder, fileName);

            // 4. Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{subFolder}/{fileName}";
        }

        public void DeleteFile(string relativeFilePath)
        {
            if (string.IsNullOrEmpty(relativeFilePath)) return;

            // Remove leading slash if present
            var cleanPath = relativeFilePath.TrimStart('/');
            var absolutePath = Path.Combine(_environment.WebRootPath, cleanPath);

            if (File.Exists(absolutePath))
            {
                File.Delete(absolutePath);
            }
        }
    }
}
