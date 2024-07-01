const fetcher_data =
{
    reads: [
        {
            name: "users",
            path: "/admin/users",
            method: "GET",
            formatter_function: (data) => {
                data = data.map((item) => {
                    let new_data = { ...item };

                    delete new_data["password"];
                    new_data["balance"] = new_data["balance"] / 100000000 + " USD";
                    return new_data;
                })

                console.log(data)
                return data;
            }

        },
        {
            name: "positions",
            path: "/admin/positions",
            method: "GET",
            formatter_function: (data) => {
                data = data.map((item) => {
                    let new_data = { ...item };

                    // delete new_data["password"];
                    new_data["capital"] = new_data["capital"] / 100000000 + " USD";
                    return new_data;
                })

                console.log(data)
                return data;
            }

        },
        {
            name: "plans",
            path: "/plans",
            method: "GET",
            formatter_function: (data) => {
                data = data.map((item) => {
                    let new_data = { ...item };

                    // delete new_data["password"];
                    new_data["maximum_amount"] = new_data["maximum_amount"] / 100000000 + " USD";
                    new_data["minimum_amount"] = new_data["minimum_amount"] / 100000000 + " USD";
                    new_data["interest_rate"] = new_data["interest_rate"] + " %";
                    new_data["duration"] = new_data["duration"] + " " + new_data["duration_in"];
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
        {
            name: "create_plan",
            path: "/admin/create_plan",
            method: "POST",
            requiredData: [
                {
                    name: "id",
                    type: "string",
                },
                {
                    name: "name",
                    type: "string",
                },
                {
                    name: "minimum_amount",
                    type: "number",
                },
                {
                    name: "maximum_amount",
                    type: "number",
                },
                {
                    name: "interest_schedule",
                    type: "dropdown",
                    options: ["Hourly", "Daily", "Weekly", "Monthly", "Quarterly", "BiAnnually", "Yearly"]
                },
                {
                    name: "interest_rate",
                    type: "number",
                },
                {
                    name: "duration",
                    type: "number",
                },
                {
                    name: "duration_in",
                    type: "dropdown",
                    // Hours,
                    // Days,
                    // Weeks,
                    // Months,
                    // Years,
                    options: ["Hours", "Days", "Weeks", "Months", "Years"]
                },
                {
                    name: "open_days",
                    type: "array",
                },
                {
                    name: "refund_capital",
                    type: "boolean",
                },
                {
                    name: "auto_prevent_capital_withdrawal",
                    type: "boolean",
                },
                {
                    name: "status",
                    type: "dropdown",
                    options: ["Active", "Ended", "Suspended", "Hidden"]
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
        let api = process.env.REACT_APP_BROKER_API;
        let path = api + route;


        console.log(`GET Broker request to ${path} with random id: ${random_id}`);
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


        let api = process.env.REACT_APP_BROKER_API;
        console.log(`POST request to ${route} with data: ${post_data} with random id: ${random_id}`)

        let path = api + route;

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
            return e.response;
        }

    }

}


export default fetcher_data;