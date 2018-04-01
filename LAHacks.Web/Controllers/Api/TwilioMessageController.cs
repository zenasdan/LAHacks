using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using Twilio.TwiML;
using Twilio.AspNet.Mvc;

namespace LAHacks.Web.Controllers.Api
{
    public class TwilioMessageController : TwilioController
    {
       public ActionResult SendSms(string phoneNumber, string textMessage)
        {
            var accountSid = "ACe95b8f117c0704e50fe3045ca4b89841";
            var authToken = "5f7ee7f507361389fa35360b18d4d272";
            TwilioClient.Init(accountSid, authToken);

            var to = new PhoneNumber(phoneNumber);
            var from = new PhoneNumber("+13236883958");

            var message = MessageResource.Create(
                to: to,
                from: from,
                body: textMessage);
            return Content(message.Sid);
        }
    }
}