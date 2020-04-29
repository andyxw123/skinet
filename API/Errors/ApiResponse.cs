using System;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace API.Errors
{
    public class ApiResponse
    {
        public ApiResponse(HttpStatusCode httpStatus, string message = null)
            : this((int)httpStatus, message)
        {

        }

        public ApiResponse(int statusCode, string message = null)
        {
            this.StatusCode = statusCode;
            this.Message = message ?? GetDefaultForStatusCode(statusCode);
        }

        public string Message { get; set; }

        public int StatusCode { get; set; }

        private string GetDefaultForStatusCode(int statusCode)
        {
            return statusCode switch
            {
                (int)HttpStatusCode.BadRequest => "Bad request",
                (int)HttpStatusCode.Unauthorized => "Unauthorized",
                (int)HttpStatusCode.NotFound => "Resource not found",
                (int)HttpStatusCode.InternalServerError => "Internal Server Error",
                _ => ((HttpStatusCode)statusCode).ToString()
            };
        }

        public static UnauthorizedObjectResult Unauthorized(string message = null)
        {
            return new UnauthorizedObjectResult(new ApiResponse(HttpStatusCode.Unauthorized, message));
        }

        public static NotFoundObjectResult NotFound(string message = null)
        {
            return new NotFoundObjectResult(new ApiResponse(HttpStatusCode.NotFound, message));
        }

        public static BadRequestObjectResult BadRequest(string message = null)
        {
            return new BadRequestObjectResult(new ApiResponse(HttpStatusCode.BadRequest, message));
        }
    }
}