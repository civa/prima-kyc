const fetcher_data =
{
    reads: [
        {
            name: "shipments",
            path: "/shipments",
            method: "GET",
            formatter_function: (data) => {
                data = data.shipments.map((item) => {
                    let new_data = { ...item };

                    new_data["updates"] = null
                    return new_data;
                })

                console.log(data)
                return data;
            }

        },
        // {
        //     name: "accounts",
        //     path: "/admin/accounts",
        //     method: "GET",
        //     formatter_function: (data) => {
        //         data = data.map((item) => {
        //             let new_data = { ...item };
        //             new_data["balance"] = new_data["balance"] / 100000000 + " USD";
        //             new_data["frozen_balance"] = new_data["frozen_balance"] / 100000000 + " USD";
        //             return new_data;
        //         })

        //         console.log(data)
        //         return data;
        //     }
        // },
        // {
        //     name: "transactions",
        //     path: "/admin/transactions",
        //     method: "GET",
        //     formatter_function: (data) => {
        //         data = data.map((item) => {
        //             let new_data = { ...item };
        //             new_data["amount"] = new_data["amount"] / 100000000 + " USD";

        //             return new_data;
        //         })

        //         console.log(data)
        //         return data;
        //     }
        // }
    ],
    writes: [

        // pub tracking_id: String,
        // pub cargo_handler: String,
        // pub sender: String,
        // pub receiver: String,
        // pub from: String,
        // pub to: String,
        // pub date_and_time_recieved: String,
        // pub estimate_delivery_date: String,
        // pub type_of_shipment: String,
        // pub weight_of_shipment: String,
        // pub type_of_package: String,
        // pub status: Status,
        // pub updates: Option<Vec<Updates>>,

        // InTransit,
        // Delivered,
        // Received,
        // OnHold,
        // #[serde(rename = "On transit")]
        // OnTransit


        {
            name: "create_shipment",
            path: "/shipment",
            method: "POST",
            requiredData: [
                {
                    name: "tracking_id",
                    type: "string",
                },
                {
                    name: "cargo_handler",
                    type: "string",
                },
                {
                    name: "sender",
                    type: "string",
                },
                {
                    name: "receiver",
                    type: "string",
                },
                {
                    name: "from",
                    type: "string",
                },
                {
                    name: "to",
                    type: "string",
                },
                {
                    name: "date_and_time_recieved",
                    type: "date",
                },
                {
                    name: "estimate_delivery_date",
                    type: "date",
                },
                {
                    name: "type_of_shipment",
                    type: "string",
                },
                {
                    name: "weight_of_shipment",
                    type: "string",
                },
                {
                    name: "type_of_package",
                    type: "string",
                },
                {
                    name: "status",
                    type: "dropdown",
                    options: ["InTransit", "Delivered", "Received", "OnHold", "On transit"]
                },


            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },

        //     pub logo : String,
        // pub domain: String,
        // pub company_name: String,
        // pub address1 : String,
        // pub address2 : String,
        // pub phone : String,
        // pub email_prefix: String


        //     pub new_location: String,
        // pub cargo_handler: String,
        // pub customs_remarks: String,
        // pub status: Status,
        // pub time: String,
        {
            name: "update location",
            path: "/shipment",
            method: "POST",
            requiredData: [
                {
                    name: "tracking_id",
                    type: "string",
                },
                {
                    name: "new_location",
                    type: "string",
                },
                {
                    name: "cargo_handler",
                    type: "string",
                },
                {
                    name: "customs_remarks",
                    type: "string",
                },
                {
                    name: "status",
                    type: "dropdown",
                    options: ["InTransit", "Delivered", "Received", "OnHold", "On Transit"]
                },
                {
                    name: "time",
                    type: "date",
                },
            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "site settings",
            path: "/update_config",
            method: "POST",
            requiredData: [
                {
                    name: "logo",
                    type: "string",
                },
                {
                    name: "domain",
                    type: "string",
                },
                {
                    name: "company_name",
                    type: "string",
                },
                {
                    name: "address1",
                    type: "string",
                },
                {
                    name: "address2",
                    type: "string",
                },
                {
                    name: "phone",
                    type: "string",
                },
                {
                    name: "email_prefix",
                    type: "string",
                },

            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },

    ],

    async getData(route, formatter_function) {
        let random_id = Math.floor(Math.random() * 1000);
        let api = process.env.REACT_APP_COURIER_API;
        let path = api + route;


        console.log(`GET Courier request to ${path} with random id: ${random_id}`);




        try {
            let data = await fetch(path, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-tenant-id": `${localStorage.getItem("tenantId")}`,
                    "Authorization": `Bearer ${localStorage.getItem("token")}`

                },

            });

            let status = data.status;

            console.log(status)

            console.log(data)
            if (status == 401) {
                console.log("Unauthorized")
                return "Unauthorized"
            }
            if (status == 400) {
                console.log("Unauthorized")
                return "err"
            }
            data = await data.json();
            console.log(`GET request to ${route} with random id: ${random_id} returned: ${data}`);

            if (formatter_function) {
                data = formatter_function(data);
            }
            return data;


        } catch (e) {
            console.log(e)
            return "err"
        }


    },
    async postData(route, post_data) {
        let random_id = Math.floor(Math.random() * 1000);



        let api = process.env.REACT_APP_COURIER_API;
        console.log(`POST request to ${route} with data: ${post_data} with random id: ${random_id}`)

        let path = api + route;

        if (route == "/shipment" && post_data.new_location) {
            path = path + "/" + post_data.tracking_id;
        }

        if (route == "/shipment" && post_data.updating) {
            path = path + "/" + post_data.tracking_id;
        }

        try {
            let data = await fetch(path, {
                method: "POST",
                body: JSON.stringify(post_data),
                headers: {
                    "Content-Type": "application/json",
                    "x-tenant-id": `${localStorage.getItem("tenantId")}`,
                    "Authorization": `Bearer ${localStorage.getItem("token")}`

                },
            });

            let status = data.status;
            if (status == 401) {
                console.log("Unauthorized")
                return "Unauthorized"
            }

            let json = await data.json();

            if (status == 400) {
                console.log("Unauthorized")
                return json.error || json.message || json;
            }

            console.log(`POST request to ${route} with data: ${data} with random id: ${random_id} returned: ${json}`);
            return "successful";

        } catch (e) {
            console.log(e)
            let returnData = {
                data: e,
                status: 500
            }
            return "Unsuccessful";
        }

    }

}


export default fetcher_data;