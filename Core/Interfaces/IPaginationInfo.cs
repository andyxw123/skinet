namespace Core.Interfaces
{
    public interface IPaginationInfo
    {
        int PageIndex { get; }
        int PageSize { get; }
        int Count { get; }
    }
}