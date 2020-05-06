using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class BasketItemDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [Range(0.1, double.MaxValue, ErrorMessage = "{0} must be greater than zero")]
        public decimal Price { get; set; }
        [Required]
        public string PictureUrl { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "{0} must be {1} or more")]
        public int Quantity { get; set; }
    }
}