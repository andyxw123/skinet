using System;
using System.Net;
using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiExplorerSettings(IgnoreApi = true)]
    public class BuggyController : BaseApiController
    {
        [HttpGet("notfound")]
        public IActionResult GetNotFoundRequest()
        {
            return ApiResponse.NotFound();
        }

        [HttpGet("servererror")]
        public IActionResult GetServerError()
        {
            throw new Exception("Error");
        }

        [HttpGet("badrequest")]
        public IActionResult GetBadRequest()
        {
            return ApiResponse.BadRequest();
        }

        [HttpGet("badrequest/{id}")]
        public IActionResult GetNotFoundRequest(int id)
        {
            return Ok();
        }
    }
}