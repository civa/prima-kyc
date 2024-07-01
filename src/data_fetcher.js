import axios from "axios";

const fetcher_data =
{
    reads: [
        {
            name: "customers",
            path: "/admin/customers",
            method: "GET",
            formatter_function: (data) => {
                data = data.map((item) => {
                    let new_data = { ...item };
                    new_data["is_active"] = new_data["is_active"] ? "✅" : "❌";
                    new_data["is_transfer_blocked"] = new_data["is_transfer_blocked"] ? "✅" : "❌";
                    new_data["is_pending_suspension_on_tx"] = new_data["is_pending_suspension_on_tx"] ? "✅" : "❌";
                    return new_data;
                })

                console.log(data)
                return data;
            }

        },
        {
            name: "accounts",
            path: "/admin/accounts",
            method: "GET",
            formatter_function: (data) => {
                data = data.map((item) => {
                    let new_data = { ...item };
                    new_data["balance"] = new_data["balance"] / 100000000 + " USD";
                    new_data["frozen_balance"] = new_data["frozen_balance"] / 100000000 + " USD";
                    return new_data;
                })

                console.log(data)
                return data;
            }
        },
        {
            name: "transactions",
            path: "/admin/transactions",
            method: "GET",
            formatter_function: (data) => {
                data = data.map((item) => {
                    let new_data = { ...item };
                    new_data["amount"] = new_data["amount"] / 100000000 + " USD";

                    return new_data;
                })

                console.log(data)
                return data;
            }
        }
    ],
    writes: [
        {
            name: "block on next transfer",
            path: "/admin/suspend_on_next_transfer",
            method: "POST",
            requiredData: [{
                name: "user_id",
                type: "string",
            },
            {
                name: "action",
                type: "dropdown",
                options: ["Suspend", "Unsuspend"]
            }],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "create user",
            path: "/admin/create_customer",
            method: "POST",
            requiredData: [{
                name: "first_name",
                type: "string",
            },
            {
                name: "last_name",
                type: "string",
            },
            {
                name: "password",
                type: "string",
            },
            {
                name: "is_active",
                type: "boolean",
            },
            {
                name: "is_pending_suspension_on_tx",
                type: "boolean",
            },
            {
                name: "dob",
                type: "string",
            },
            {
                name: "pin_code",
                type: "string",
            },
            {
                name: "email",
                type: "string",
            },
            {
                name: "phone",
                type: "string",
            },
            {
                name: "address",
                type: "string",
            },
            {
                name: "city",
                type: "string",
            },
            {
                name: "state",
                type: "string",
            },
            {
                name: "country",
                type: "string",
            },
            {
                name: "zip",
                type: "string",
            },
            {
                name: "created_at",
                type: "string",
            },
            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },

        {
            name: "edit user",
            path: "/admin/edit_customer",
            method: "POST",
            requiredData: [
                {
                    name: "user_id",
                    type: "string",
                },

                {
                    name: "first_name",
                    type: "string",
                },
                {
                    name: "last_name",
                    type: "string",
                },
                {
                    name: "password",
                    type: "string",
                },
                {
                    name: "is_active",
                    type: "boolean",
                },
                {
                    name: "is_pending_suspension_on_tx",
                    type: "boolean",
                },
                {
                    name: "dob",
                    type: "string",
                },
                {
                    name: "pin_code",
                    type: "string",
                },
                {
                    name: "email",
                    type: "string",
                },
                {
                    name: "phone",
                    type: "string",
                },
                {
                    name: "address",
                    type: "string",
                },
                {
                    name: "city",
                    type: "string",
                },
                {
                    name: "state",
                    type: "string",
                },
                {
                    name: "country",
                    type: "string",
                },
                {
                    name: "zip",
                    type: "string",
                },
                {
                    name: "created_at",
                    type: "string",
                },
            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "credit user",
            path: "/admin/credit_account",
            method: "POST",
            requiredData: [{
                name: "amount",
                type: "number",
            },
            {
                name: "account_number",
                type: "string",
            }],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "debit user",
            path: "/admin/debit_account",
            method: "POST",
            requiredData: [{
                name: "amount",
                type: "number",
            },
            {
                name: "account_number",
                type: "string",
            }],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "suspend_account",
            path: "/admin/suspend_account",
            method: "POST",
            requiredData: [{
                name: "user_id",
                type: "string",
            },
            {
                name: "action",
                type: "dropdown",
                options: ["Suspend", "Unsuspend"]
            }],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "set account limit",
            path: "/admin/set_account_limit",
            method: "POST",
            requiredData: [
                {
                    name: "account_number",
                    type: "string",
                },
                {
                    name: "daily_limit",
                    type: "number",
                },
                {
                    name: "monthly_limit",
                    type: "number",
                }
            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "change_transaction_date",
            path: "/admin/change_transaction_date",
            method: "POST",
            requiredData: [
                {
                    name: "transaction_id",
                    type: "string",
                },
                {
                    name: "new_date",
                    type: "string",
                }
            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "create debit card",
            path: "/admin/create_card",
            method: "POST",
            requiredData: [
                {
                    name: "account_to_link",
                    type: "string",
                }

            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "delete_user",
            path: "/admin/delete_user",
            method: "POST",
            requiredData: [
                {
                    name: "uuid",
                    type: "string",
                }

            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "change_account_type",
            path: "/admin/change_account_type",
            method: "POST",
            requiredData: [
                {
                    name: "account_number",
                    type: "string",
                },
                {
                    name: "action",
                    type: "dropdown",
                    options: ["Savings", "Current", "Personal", "Corporate", "Business"]
                }

            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "change_transaction_status",
            path: "/admin/change_transaction_status",
            method: "POST",
            requiredData: [
                {
                    name: "transaction_id",
                    type: "string",
                },
                {
                    name: "action",
                    type: "dropdown",
                    options: ["Pending", "Completed", "Approved"]
                }

            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "update_frontend_config",
            path: "/admin/change_transaction_status",
            method: "POST",
            requiredData: [
                {
                    name: "logo",
                    type: "string",
                },
                {
                    name: "logo_name",
                    type: "string",
                },
                {
                    name: "currency",
                    type: "string",
                },
                {
                    name: "short_name",
                    type: "string",
                },
                {
                    name: "phone_number",
                    type: "string",
                },
                {
                    name: "company_name",
                    type: "string",
                },
                {
                    name: "domain",
                    type: "string",
                }

            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "backdate",
            path: "/admin/backdate",
            method: "POST",
            requiredData: [
                {
                    name: "backdate_type",
                    type: "dropdown",
                    options: ["User", "Transaction"]
                },
                {
                    name: "identifier",
                    type: "string",
                },
                {
                    name: "num_days",
                    type: "number",
                },


            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },
        {
            name: "suspend_transfer",
            path: "/admin/suspend_transfer",
            method: "POST",
            requiredData: [
                {
                    name: "action",
                    type: "dropdown",
                    options: ["Suspend", "Unsuspend"]
                },
                {
                    name: "user_id",
                    type: "string",
                },


            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },

        {
            name: "create_transaction",
            path: "/admin/create_transaction",
            method: "POST",
            requiredData: [

                {
                    name: "flow_direction",
                    type: "dropdown",
                    options: ["Inflow", "Outflow"]
                },
                {
                    name: "bank_account",
                    type: "string",
                },
                {
                    name: "payment_type",
                    type: "string",
                },
                {
                    name: "amount",
                    type: "number",
                },

                {
                    name: "description",
                    type: "string",
                },
                {
                    name: "country",
                    type: "string",
                },
                {
                    name: "receiving_bank",
                    type: "string",
                },
                {
                    name: "account_holder_name",
                    type: "string",
                },
                {
                    name: "receiving_account",
                    type: "string",
                },
                {
                    name: "routing_number",
                    type: "string",
                },
                {
                    name: "swift_code",
                    type: "string",
                },
                {
                    name: "backdate",
                    type: "number",
                },
                {
                    name: "status",
                    type: "dropdown",
                    options: ["Pending", "Submitted", "Completed"]
                },

            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },


        {
            name: "site settings",
            path: "/admin/update_frontend_config",
            method: "POST",
            requiredData: [
                {
                    name: "logo",
                    type: "string",
                },
                {
                    name: "logo_name",
                    type: "string",
                },
                {
                    name: "currency",
                    type: "string",
                },
                {
                    name: "short_name",
                    type: "string",
                },
                {
                    name: "phone_number",
                    type: "string",
                },
                {
                    name: "company_name",
                    type: "string",
                },
                {
                    name: "domain",
                    type: "string",
                },
                {
                    name: "hide_last_login_details",
                    type: "boolean",
                }

            ],
            formatter_function: (data) => {
                console.log(data)
            }
        },
    ],

    async getData(route, formatter_function) {
        let random_id = Math.floor(Math.random() * 1000);
        let api = process.env.REACT_APP_BANKING_API;
        let path = api + route;
        console.log(`GET request to ${path} with random id: ${random_id}`);


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

            console.log(data)
            if (status == 401) {
                console.log("Unauthorized")
                return "Unauthorized"
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

        let api = process.env.REACT_APP_BANKING_API;
        console.log(`POST request to ${route} with data: ${post_data} with random id: ${random_id}`)

        try {
            let { data } = await axios.post(api + route, post_data, {
                headers: {
                    "Content-Type": "application/json",
                    "x-tenant-id": `${localStorage.getItem("tenantId")}`,
                    "Authorization": `Bearer ${localStorage.getItem("token")}`

                },
            });

            let json = data
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