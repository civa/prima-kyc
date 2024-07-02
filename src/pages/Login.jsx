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
import axios from "axios";

export default function Component({ app, setApp, setReloadStuffs, setUsers }) {
  const [api, setApi] = useState(localStorage.getItem("api_key") || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {


    let { data, status } = await axios.get("https://api.unsxchange.com/admin/kyc/get/all", {
      headers: {
        "Authorization": "Bearer " + api
      }
    })

    setUsers(data);
    navigate("/kyc");



  };



  let dropdownItems = ["Banking", "Courier", "Broker"]
  return (
    <div className="min-h-screen w-[95%] mx-auto flex items-center justify-center">
      <Card className="mx-auto my-auto max-w-md">

        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your API key to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api">TID</Label>
              <Input
                id="api"
                type="api"
                placeholder="api"
                value={api}
                onChange={(e) => {
                  setReloadStuffs(Math.random());
                  localStorage.setItem("api_key", e.target.value);
                  setApi(e.target.value)
                }}
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
