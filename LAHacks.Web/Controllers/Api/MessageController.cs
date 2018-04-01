using System.Web.Mvc;
using Twilio.AspNet.Common;
using Twilio.AspNet.Mvc;
using Twilio.TwiML;

namespace LAHacks.Web.Controllers.Api
{
    public class MessageController : TwilioController
    {
        [HttpPost]
        public TwiMLResult Index(SmsRequest request)
        {
            var response = new MessagingResponse();
            response.Message("LA HACKS");
            return TwiML(response);
        }
    }
}