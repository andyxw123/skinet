using System.Net;
using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("errors/{statusCode}")]
    [ApiExplorerSettings(IgnoreApi = true)] //Allows Swagger to ignore this controller
    public class ErrorController : BaseApiController
    {
        public IActionResult Error(HttpStatusCode statusCode)
        {
            return new ObjectResult(new ApiResponse(statusCode));
        }
    }
}