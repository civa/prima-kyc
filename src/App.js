import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import TablePage from "./pages/Table";
import Renewal from "./pages/Renewal";
import Deployer from "./pages/Deployer";
import FormPage from "./pages/Form";
import TopUpPID from "./pages/TopUpPID";
import Extend from "./pages/Extend";
import Layout from "./Layout/Layout";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [app, setApp] = useState(localStorage.getItem("selectedApp") || "banking");
  const [users, setUsers] = useState([]);
  const [reloadStuffs, setReloadStuffs] = useState(1);


  async function getUsers() {
    try {
      let { data, status } = await axios.get("https://api.unsxchange.com/admin/kyc/get/all", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("api_key")
        }
      })
      setUsers(data);
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getUsers();
  }, [reloadStuffs]);
  return (
    <>
      <ToastContainer />
      <Routes>

        <Route path="/" element={<Layout app={app} setApp={setApp} reloadStuffs={reloadStuffs} />}>
          <Route path="/" element={<Login setUsers={setUsers} app={app} setApp={setApp} setReloadStuffs={setReloadStuffs} />}></Route>

          <Route element={<Login setUsers={setUsers} app={app} setApp={setApp} setReloadStuffs={setReloadStuffs} />} path="/login" />
          <Route path="kyc" element={<Deployer app={app} setApp={setApp} users={users} />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
