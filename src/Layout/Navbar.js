import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CircleUser, Menu, Package2, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import moment from "moment";


const Navbar = ({ app, reloadStuffs }) => {

  console.log(window.location.pathname)

  let [valid_till, setValidTill] = useState("");
  let [is_valid_tenant, setIsValidTenant] = useState(false);

  async function getExpirtyInfo() {
    let api = `https://sentinel.solidhash.io/peripheral-license/license/tenant/validity/${localStorage.getItem("tenantId")}`
    try {
      let data = await fetch(api);
      let json = await data.json();


      if (json.url == "s") {
        setIsValidTenant(false);
        return;
      }
      console.log(json.valid_until)


      let date = new Date(json.valid_until);
      let moment_human = moment(date).diff(moment(), 'days') + " days";
      console.log(moment_human)
      setValidTill(moment_human);
      setIsValidTenant(true);

    } catch (e) {

    }
  }

  useEffect(() => {
    getExpirtyInfo();
  }, [reloadStuffs]);

  // if app == courier
  let navItems = [
    // { navItem: "Reads", to: "/reads" },
    // { navItem: "Update", to: "/writes" },
    { navItem: "Login", to: "/" },

  ]





  if (app == "courier") {

    navItems.push(
      { navItem: "Receipt", to: "https://receipt-courier.vercel.app" });
  }
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {window.location.pathname != "/login" && window.location.pathname != "/" && window.location.pathname != "/renew" && <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
        </NavLink>

        {navItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? "font-bold text-white text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                : "text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            }
          >
            {item.navItem}
          </NavLink>
        ))}
      </nav>}
      {<Sheet open={sidebar}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={() => setSidebar((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <div className="flex items-center justify-between">
              <NavLink
                to="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
              </NavLink>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebar(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {navItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.to}
                onClick={() => setSidebar((prev) => !prev)}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-white text-muted-foreground hover:text-foreground cursor-pointer"
                    : "text-muted-foreground hover:text-foreground cursor-pointer"
                }
              >
                {item.navItem}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>}
      {is_valid_tenant && <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> */}
            <Input
              type="search"
              disabled={true}
              placeholder={`${localStorage.getItem("tenantId").length < 10 ? localStorage.getItem("tenantId") : localStorage.getItem("tenantId").substring(0, 10)} expires :  ${valid_till}`}
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"

            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/renew")}>
              Sub
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/login")}>
              Go to Login
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>}
    </header>
  );
};

export default Navbar;
