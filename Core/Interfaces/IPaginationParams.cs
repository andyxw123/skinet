namespace Core.Interfaces
{
    public interface IPaginationParams
    {
        int PageIndex { get; set; }
        int PageSize { get; set; }
    }
}