using System.Linq.Expressions;

namespace FuturisticPortfolio.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<T?> GetByIdAsync(int id);
        Task<T?> GetByIdAsync(string id); // For string IDs (like Users)
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}
