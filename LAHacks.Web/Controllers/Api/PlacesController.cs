using LAHacks.Models.Requests;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace LAHacks.Web.Controllers.Api
{
    [RoutePrefix("api/places")]
    public class PlacesController : ApiController
    {
        [Route(), HttpPost]
        public HttpResponseMessage GetPlaces(Place model)
        {
            try
            {                
                using (WebClient client = new WebClient()) { 
                    string jsonStr = string.Empty;
                    {
                        jsonStr = client.DownloadString("https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + HttpUtility.UrlEncode(model.queryString) + "&key=AIzaSyCQHmEUFcYPARF3giLsM9N5pky702WRA2g");
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, !string.IsNullOrEmpty(jsonStr) ? JsonConvert.DeserializeObject<Object>(jsonStr) : new Object());
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        } 
    }
}
