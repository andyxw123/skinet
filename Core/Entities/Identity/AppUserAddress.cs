using System.Text.Json.Serialization;

namespace Core.Entities.Identity
{
    public class AppUserAddress : Address
    {
        [JsonIgnore]
        public string AppUserId { get; set; }
        [JsonIgnore]
        public AppUser AppUser { get; set; }
    }
}