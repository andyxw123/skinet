using System;
using System.Net;
using System.Text;
using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    public class BuggyController : BaseApiController
    {
        [HttpGet("testauth")]
        [Authorize]
        public ActionResult<string>GetSecretText()
        {
            return "secret stuff";
        }

        [HttpGet("notfound")]
        public IActionResult GetNotFoundRequest()
        {
            return ApiResponse.NotFound();
        }

        [HttpGet("servererror")]
        public IActionResult GetServerError()
        {
            // Simulate a null reference exception
            StringBuilder builder = null;
            string result = builder.ToString();

            return Ok(result);
        }

        [HttpGet("badrequest")]
        public IActionResult GetBadRequest()
        {
            return ApiResponse.BadRequest();
        }

        [HttpGet("badrequest/{id}")]
        public IActionResult GetNotFoundRequest(int id)
        {
            // If an attempt is made to call this controller with an id value as a string,
            // then the response will include an  ApiValidationErrorResponse object containing
            // an array of validation errors (such as "The value 'blah' is not valid")
            return Ok();
        }
    }
}