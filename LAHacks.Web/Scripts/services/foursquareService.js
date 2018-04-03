(function () {
    'use strict';
    angular.module(appName).service("foursquareService", FoursquareService);

    FoursquareService.$inject = ["$http"];

    function FoursquareService($http) {
       
        this.getVenuesByHistoricCategory = () => {
            const client_id = "AYKRCHFZCCWTDDT2JKTDB0FR5YZQPCSXNMPNCO3LNCP5KDLI";
            const client_secret = "ZPV0A1ZTPEAZP4OBFQCOS0WGM1ZCHZ0BZGU2X4UE1MBV3TSF";
            const base_url = "https://api.foursquare.com/v2/venues/explore/?near=";
            let categories = [];
            categories.push("4deefb944765f83613cdba6e"); // "Historic Site"
            categories.push("4bf58dd8d48988d190941735"); // "History Museum"
            categories.push("4bf58dd8d48988d191941735"); // "Science Museum"
            categories.push("5642206c498e4bfca532186c"); // "Memorial Site"

            return $http({
                method: "GET",
                url: base_url + "UCLA" +
                    "&venuePhotos=1&categoryId=" +
                    categories.join('&') +
                    "&client_id=" + client_id +
                    "&client_secret=" + client_secret +
                    "&v=" + (new Date()).toISOString().slice(0, 10).replace(/-/g, "")
            }).then((resp, status) => {
                console.log("RESP.DATA.RESPONSE.GROUPS[0].ITEMS: ", resp.data.response.groups[0].items);
                localStorage.setItem("venues", JSON.stringify(resp.data.response.groups[0].items));
            }, (data, status) => {
                swal({
                    title: "No Results Found",
                    text: "Please try with another location",
                    icon: "error"
                }); 
               
            }).catch(err => {
                swal({
                    title: "Something went wrong",
                    text: err.message,
                    icon: "error"
                });
                
            });
        }

        this.twilioMessage = (number, textMessage) => {
            const base_url = "http://localhost:3024/TwilioMessage/SendSms";
            return $http({
                method: "POST",
                url: base_url,
                data: {
                phoneNumber: number,
                textMessage: "List of Amazing Historic places around us" +"\n"+textMessage
                }
            }).then((resp, status) => {
                swal("Message Sent!");
            }, (data, status) => {
                swal({
                    title: "No Results Found",
                    text: "Please Check the Number",
                    icon: "error"
                });

            }).catch(err => {
                swal({
                    title: "Something went wrong",
                    text: err.message,
                    icon: "error"
                });

            });
        }
    }
})();