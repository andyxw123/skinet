namespace Core.Interfaces
{
    public interface IAddress
    {
        string FirstName { get; set; }
        string LastName { get; set; }
        string Street { get; set; }
        string City { get; set; }
        string State { get; set; }
        string Zipcode { get; set; }
    }
}