import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import fetcher_data from "../data_fetcher";
import courier_fetch from "../courier_fetcher";
import broker_fetch from "../broker_fetcher";

import { toast } from "react-toastify";
import { set } from "date-fns";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

export default function Component({ app, setApp, setReloadStuffs }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // fetcher_data.reads[0].path;
    // lets check the app if its banking we use banking api 
    // if its courier we use courier api

    let first_api = "";

    console.log(app);

    if (app == "banking") {
      first_api = fetcher_data.reads[0].path;
    }
    if (app == "courier") {
      first_api = courier_fetch.reads[0].path;
      console.log(first_api)
    }
    if (app == "broker") {
      first_api = broker_fetch.reads[0].path;
      console.log(first_api)
    }


    toast.loading(`Logging in to ${app}`, {
      theme: "dark",
      position: "bottom-center",
    });


    localStorage.setItem("tenantId", username);
    localStorage.setItem("token", password);


    let get = null;

    if (app == "banking") {
      get = await fetcher_data.getData(first_api, fetcher_data.reads[0].formatter_function);
    }

    if (app == "courier") {
      get = await courier_fetch.getData(first_api, courier_fetch.reads[0].formatter_function);
    }

    if (app == "broker") {
      get = await broker_fetch.getData(first_api, broker_fetch.reads[0].formatter_function);
    }

    if (get == "Unauthorized") {
      setError("Invalid Credentials");
      toast.error("Invalid Credentials Submitted", {
        theme: "dark",
        position: "bottom-center",

      });
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      return "Unauthorized"

    }
    if (get == "err") {
      setError("Invalid Credentials");
      toast.error("Invalid Credentials");
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      return;
    } else {
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      navigate("/reads");
    }



    let dropdownItems = ["s"]


  };



  let dropdownItems = ["Banking", "Courier", "Broker"]
  return (
    <div className="min-h-screen w-[95%] mx-auto flex items-center justify-center">
      <Card className="mx-auto my-auto max-w-md">



        <div className="mt-auto ml-auto min-w-[150px]">
          <Select
            onValueChange={
              (value) => {
                // alert(value);
                console.log(value);

                setApp(value);

                localStorage.setItem("selectedApp", value);
                // setData([]);
                // setSelectedData(fetcher_data.reads.find((item) => item.name === value));
                // setReload(reload + 1);
              }
            }
            defaultValue={localStorage.getItem("selectedApp") || "banking"}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {dropdownItems.map((item, i) => (
                <SelectItem
                  value={item.toLowerCase()} key={i}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>




        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your TID and token to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">TID</Label>
              <Input
                id="email"
                type="email"
                placeholder="UserName"
                value={username}
                onChange={(e) => {
                  setReloadStuffs(Math.random());
                  localStorage.setItem("tenantId", e.target.value);
                  setUsername(e.target.value)
                }}
                required
                className="rounded"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Token</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded"
              onClick={handleLogin}
            >
              Login
            </Button>
            {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
