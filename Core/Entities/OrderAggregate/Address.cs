using Core.Interfaces;

namespace Core.Entities.OrderAggregate
{
    public class Address : IAddress
    {
        public Address()
        {
        }

        public Address(IAddress source)
        {
            FirstName = source.FirstName;
            LastName = source.LastName;
            Street = source.Street;
            City = source.City;
            State = source.State;
            Zipcode = source.Zipcode;
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zipcode { get; set; }
    }
}