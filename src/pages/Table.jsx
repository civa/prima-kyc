import React, { useEffect, useState } from "react";
import fetcher_data from "../data_fetcher";
import courier_fetch from "../courier_fetcher";
import broker_fetch from "../broker_fetcher";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { toast } from "react-toastify";

const TablePage = ({ app, setApp }) => {
  const [selectedData, setSelectedData] = useState(app == "banking" ? fetcher_data.reads[0] : app == "courier" ? courier_fetch.reads[0] : broker_fetch.reads[0]);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [reload, setReload] = useState(1);

  const headers = data.length > 0 ? [...new Set(data.flatMap(Object.keys))] : [];
  let dropdownItems = null;

  if (app == "banking") {
    dropdownItems = fetcher_data.reads.map((item) => item.name);
  }

  if (app == "courier") {
    dropdownItems = courier_fetch.reads.map((item) => item.name);
  }

  if (app == "broker") {
    dropdownItems = broker_fetch.reads.map((item) => item.name);
  }



  async function fetchData() {
    toast.loading("Fetching data...", {
      theme: "dark",
      position: "bottom-center"
    });
    let read_data_to_fetch = null;

    if (app == "banking") {
      read_data_to_fetch = fetcher_data.reads.find((item) => item.name === selectedData.name);
    }

    if (app == "courier") {

      read_data_to_fetch = courier_fetch.reads.find((item) => item.name === selectedData.name);
    }
    if (app == "broker") {
      console.log(broker_fetch.reads)
      console.log(selectedData.name)
      read_data_to_fetch = broker_fetch.reads.find((item) => item?.name === selectedData?.name);
    }

    let data = null;

    if (app == "banking") {
      data = await fetcher_data?.getData(read_data_to_fetch.path, read_data_to_fetch.formatter_function);
    }

    if (app == "courier") {
      data = await courier_fetch?.getData(read_data_to_fetch?.path, read_data_to_fetch.formatter_function);
    }

    if (app == "broker") {
      console.log(read_data_to_fetch)
      data = await broker_fetch?.getData(read_data_to_fetch?.path, read_data_to_fetch.formatter_function);
    }

    if (data == "err") {
      toast.error("Error fetching data");
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
      return;
    }
    if (data == "Unauthorized") {
      toast.error("Expired Authentication Token. Please login again.");
      setTimeout(() => {
        toast.dismiss();
        window.location.href = "/login";
      }, 2000);
      return;
    }
    setData(data);
    toast.dismiss();
  }

  useEffect(() => {
    fetchData();
  }, [reload, selectedData]);

  // Filter data based on the filter input
  const filteredData = data.filter(row =>
    headers.some(header => row[header]?.toString().toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="flex w-[90%] mx-auto flex-col py-12 max-w-4xl gap-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold">Read Data</h1>
          <p className="text-balance text-muted-foreground">
            Fetch data from backend
          </p>
        </div>{" "}
        <div className="mt-auto ml-auto min-w-[150px]">
          <Select
            onValueChange={(value) => {
              console.log(value);
              setData([]);
              setSelectedData(app == "banking" ? fetcher_data.reads.find((item) => item.name === value) : app == "courier" ? courier_fetch.reads.find((item) => item.name === value) : broker_fetch.reads.find((item) => item.name === value));
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
      <div className="flex items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Filter data"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
      </div>
      <Table className="w-full mx-auto border p-20 rounded">
        <TableHeader className="p-16">
          <TableRow>
            {headers && headers.map((header, i) => (
              <TableHead key={i} className="w-[100px]">
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, i) => (
            <TableRow key={i}>
              {headers.map((header, j) => (
                <TableCell key={j} className="font-medium text-nowrap">
                  {item[header] || "-"}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    Open
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablePage;
