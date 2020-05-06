using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace API.Errors
{
    public class ApiValidationErrorResponse : ApiResponse
    {
        public ApiValidationErrorResponse() : base(HttpStatusCode.BadRequest)
        {
        }

        public IEnumerable<string> Errors { get; set; }

        public static BadRequestObjectResult BadRequest(params string[] errors)
        {
            return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = errors });
        }
    }
}