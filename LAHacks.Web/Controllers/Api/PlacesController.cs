using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LAHacks.Web.Controllers.Api
{
    [RoutePrefix("api/places")]
    public class PlacesController : ApiController
    {
        [Route(), HttpPost]
        public HttpResponseMessage GetPlaces(queryString model)
        {
            try
            {
                WebClient client = new WebClient();
                string response = client.DownloadString("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + model.temp + "&key=AIzaSyCQHmEUFcYPARF3giLsM9N5pky702WRA2g");
                return Request.CreateResponse(HttpStatusCode.OK, response);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        } 

        public class queryString
        {
            public string temp { get; set; }
        }

    }
}
