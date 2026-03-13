import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
} from "@heroui/react";
import logo from "../../assets/images/social-logo.jpeg";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function MyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loggedMenuItems = ["Home", "Log Out"];
  const unLoggedMenuItems = ["Login", "Register"];

  const { userLogin, setuserLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  function logOut() {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    navigate("/login");
  }

  return (
    <Navbar>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarBrand className="flex gap-2">
        <div className="imgLogo w-[50px] h-[50px] rounded-[30px]">
          <img className="w-full rounded-[30px]" src={logo} alt="social logo" />
        </div>
        <p className="font-bold  text-blue-600">
          <Link to="/">AYATEE</Link>
        </p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {userLogin !== null && (
            <NavbarItem>
              <Link color="foreground" to="/">
                Home
              </Link>
            </NavbarItem>
          )}

          {userLogin === null && (
            <>
              <NavbarItem>
                <Link color="foreground" to="/login">
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link color="foreground" to="/register">
                  Register
                </Link>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              // Will change whith login user avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile">
              <Link className="w-full block" to="profile">
                Profile
              </Link>
            </DropdownItem>
            <DropdownItem key="setting">
              <Link className="w-full block" to="setting">
                Settings
              </Link>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={() => logOut()}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        {userLogin
          ? loggedMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                onClick={item === "Log Out" && function(){ logOut() }}
                  className="w-full block "
                  color={
                    index === 2
                      ? "primary"
                      : index === loggedMenuItems.length - 1
                        ? "danger"
                        : "foreground"
                  }
                  to={`/${item === "Log Out" ? "login" : item}`}
                  size="lg"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))
          : unLoggedMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="w-full block "
                  color={
                    index === 2
                      ? "primary"
                      : index === unLoggedMenuItems.length - 1
                        ? "danger"
                        : "foreground"
                  }
                  to={`/${item}`}
                  size="lg"
                >
                  {item}
                </Link>
              </NavbarMenuItem>
            ))}
      </NavbarMenu>
    </Navbar>
  );
}
