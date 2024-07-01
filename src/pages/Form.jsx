import React, { useEffect, useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { format } from "date-fns";
import courier_fetch from "../courier_fetcher";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { cn } from "../lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

import { Button } from "../components/ui/button";
import fetcher_data from "../data_fetcher";
import broker_fetch from "../broker_fetcher";

import { toast } from "react-toastify";
import axios from "axios";

export default function FormPage({ app }) {
  const [selectedData, setSelectedData] = useState(app == "banking" ? fetcher_data.writes[0] : app == "courier" ? courier_fetch.writes[0] : app == "broker" ? broker_fetch.writes[0] : {});
  const [formData, setFormData] = useState({});
  const [requiredData, setRequiredData] = useState(selectedData.requiredData);
  const [reload, setReload] = useState(1);

  const [is_courier_edit_mode, setIsCourierEditMode] = useState(false);

  let writes = app == "banking" ? fetcher_data.writes : app == "courier" ? courier_fetch.writes : app == "broker" ? broker_fetch.writes : [];
  let dropdownItems = writes.map((item) => item.name);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: Number(value) }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: checked }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prevData) => ({ ...prevData, [name]: date }));
  };



  async function fetchExisting_courier() {
    if (app == "courier" && selectedData.name == "create_shipment") {

      // toast.loading("Checking Tracking Code...", {
      //   theme: "dark",
      //   position: "bottom-center",
      // });

      if (!formData.tracking_id) {
        return;
      }

      if (formData.tracking_id.length < 2) {
        return;
      }
      let fetch_shipments = courier_fetch.reads.find((item) => item.name === "shipments");
      let path = fetch_shipments.path;
      let data = await courier_fetch.getData(path, fetch_shipments.formatter_function);

      if (data == "Unauthorized") {
        toast.error("Unauthorized to fetch data");
        setTimeout(() => {
          toast.dismiss();
          window.location.href = "/login";
        }, 2000);
        return;
      }
      let tracking_id = formData.tracking_id;
      let existing_data = data?.find((item) => item.tracking_id === tracking_id);

      if (!existing_data) {

        setIsCourierEditMode(false);
        // reset form data
        // toast.success("Tracking Code is Valid", {
        //   theme: "dark",
        //   position: "bottom-center",
        //   toastId: "tracking_code_valid",
        // });
        return;
      }
      // toast.info(`${formData.tracking_id} Code Exists! Editing ${formData.tracking_id}`, {
      //   theme: "dark",
      //   position: "bottom-center",
      //   toastId: "tracking_code_exists",
      // })
      console.log(existing_data);

      setSelectedData({
        ...selectedData,
        path: "/edit"
      })

      setIsCourierEditMode(true);
      existing_data["updating"] = true;
      existing_data["updates"] = null;

      delete existing_data["updates"];
      setFormData(existing_data);


      return data;

    }
  }

  async function fetchExisting_user() {
    if (app == "banking" && selectedData.name == "edit user") {
      // toast.loading("Checking Tracking Code...", {
      //   theme: "dark",
      //   position: "bottom-center",
      // });

      if (!formData.user_id) {
        return;
      }

      if (formData.user_id.length < 2) {
        return;
      }
      let fetcher = fetcher_data.reads.find((item) => item.name === "customers");
      let path = fetcher.path;
      let data = await fetcher_data.getData(path, fetcher.formatter_function);

      if (data == "Unauthorized") {
        toast.error("Unauthorized to fetch data");
        setTimeout(() => {
          toast.dismiss();
          window.location.href = "/login";
        }, 2000);
        return;
      }
      let user_id = formData.user_id;
      let existing_data = data?.find((item) => item.user_id === user_id);

      if (!existing_data) {

        // setIsCourierEditMode(false);
        // reset form data
        // toast.success("Tracking Code is Valid", {
        //   theme: "dark",
        //   position: "bottom-center",
        //   toastId: "tracking_code_valid",
        // });
        return;
      }
      // toast.info(`${formData.tracking_id} Code Exists! Editing ${formData.tracking_id}`, {
      //   theme: "dark",
      //   position: "bottom-center",
      //   toastId: "tracking_code_exists",
      // })
      console.log(existing_data);

      setSelectedData({
        ...selectedData,
        path: "/admin/edit_customer"
      })

      // setIsCourierEditMode(true);
      existing_data["is_active"] = false;
      existing_data["is_pending_suspension_on_tx"] = false;
      existing_data["is_transfer_blocked"] = false;
      // existing_data["user_id"] = null;

      // delete existing_data["updates"];
      setFormData(existing_data);
      return data;

    }
  }

  async function fetch_existing_courier_config() {
    if (app == "courier" && selectedData.name == "site settings") {
      let api = process.env.REACT_APP_COURIER_API;

      let { data } = await axios.get(`${api}/config`, {
        headers: {
          "x-tenant-id": `${localStorage.getItem("tenantId")}`
        }
      });

      setFormData(data);

      console.log(data)
    }
  }

  async function fetch_existing_config() {
    if (app == "banking" && selectedData.name == "site settings") {
      let api = process.env.REACT_APP_BANKING_API;

      let { data } = await axios.get(`${api}/config`, {
        headers: {
          "x-tenant-id": `${localStorage.getItem("tenantId")}`
        }
      });

      setFormData(data);

      console.log(data)
    }
  }

  useEffect(() => {

    fetch_existing_courier_config();
    fetch_existing_config();
  }, [selectedData]);



  useEffect(() => {
    fetchExisting_courier();
  }, [formData?.tracking_id]);


  useEffect(() => {
    fetchExisting_user();
  }, [formData?.user_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Submitting data...", {
      theme: "dark",
      position: "bottom-center",
    });
    console.log(formData); // Here you can perform your desired actions with the form data
    let post = app == "banking" ? await fetcher_data?.postData(selectedData.path, formData) : app == "courier" ? await courier_fetch?.postData(selectedData.path, formData) : app == "broker" ? await broker_fetch?.postData(selectedData.path, formData) : null;
    console.log(post);
    toast.info(`${selectedData.name} response : ${post} `, {
      theme: "dark",
      position: "bottom-center",
    });
    setTimeout(() => {
      toast.dismiss();
    }, 2000);
  };

  return (
    <div className="w-[90%] mx-auto py-12 flex items-start justify-center">
      <div className="flex items-center justify-center max-w-2xl w-full border p-8 rounded shadow-lg bg-gray-900">
        <div className="mx-auto grid gap-6 w-full">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="grid gap-2">
              <h1 className="text-3xl font-bold text-white">{selectedData.name}</h1>
              <p className="text-balance text-muted-foreground text-gray-400">
                {app == "courier" && is_courier_edit_mode ? "You are editing shipment" : ""}
                {app == "banking" && ""}
              </p>
            </div>
            <div className="mt-auto ml-auto min-w-[150px]">
              <Select
                onValueChange={(value) => {
                  console.log(value);
                  setFormData({});
                  setSelectedData(
                    app == "banking" ? fetcher_data.writes.find((item) => item.name === value) : app == "courier" ? courier_fetch.writes.find((item) => item.name === value) : app == "broker" ? broker_fetch.writes.find((item) => item.name === value) : {}
                  );
                  setRequiredData(
                    app == "banking" ? fetcher_data.writes.find((item) => item.name === value).requiredData : app == "courier" ? courier_fetch.writes.find((item) => item.name === value).requiredData : app == "broker" ? broker_fetch.writes.find((item) => item.name === value).requiredData : []
                  );
                  setReload(reload + 1);
                }}
                defaultValue={dropdownItems[0].toLowerCase()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownItems.map((item, i) => (
                    <SelectItem value={item.toLowerCase()} key={i}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {requiredData.map((field, index) => (
              <div key={index} className="grid gap-2">
                <Label htmlFor={field.name} className="text-white">{field.name}</Label>
                {field.type === "string" && (
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    className="bg-gray-800 text-white placeholder-gray-500"
                    required
                  />
                )}
                {field.type === "number" && (
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    placeholder={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleNumberInputChange}
                    className="bg-gray-800 text-white placeholder-gray-500"
                    required
                  />
                )}
                {field.type === "dropdown" && (
                  <Select
                    value={formData[field.name] || ""}
                    onValueChange={(value) => handleSelectChange(field.name, value)}
                  >
                    <SelectTrigger className="bg-gray-800 text-white">
                      <SelectValue placeholder={`Select ${field.name}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                      {field.options.map((option, idx) => (
                        <SelectItem value={option} key={idx}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {field.type === "boolean" && (
                  <div className="flex items-center gap-2">
                    <input
                      id={field.name}
                      name={field.name}
                      type="checkbox"
                      checked={formData[field.name] || false}
                      onChange={handleCheckboxChange}
                      className="form-checkbox bg-gray-800 border-gray-600 text-white"
                    />
                    <Label htmlFor={field.name} className="text-white">{field.name}</Label>
                  </div>
                )}
                {field.type === "date" && (
                  <DatePicker
                    id={field.name}
                    selected={formData[field.name] || null}
                    onChange={(date) => handleDateChange(field.name, date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="w-full border rounded px-2 py-1 bg-gray-800 text-white placeholder-gray-500"
                    placeholderText={field.name}
                    required
                  />
                )}
              </div>
            ))}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
