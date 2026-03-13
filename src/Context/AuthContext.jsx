import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Components/Loader/Loader";


export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userToken, setuserToken] = useState(() => localStorage.getItem("userToken"));
  const [userId, setuserId] = useState(null);
  

  const [userLogin, setuserLogin] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      setuserLogin(localStorage.getItem("userToken"));
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      const { user } = jwtDecode(localStorage.getItem("userToken"));
      setuserId(user);
    }
  }, [userLogin]);


  const {
    data: userData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["getProfile"],
    queryFn: async () => {
      const res = await axios.get(
        "https://route-posts.routemisr.com/users/profile-data",
        {
          headers: { Authorization: `Bearer ${userLogin}` },
        },
      );
      return res.data.data.user;
    },
    enabled: !!userToken,
  });

  if (isLoading) return <Loader />;
  if (isError) return <h2>Error</h2>;

  return (
    <AuthContext.Provider value={{ userLogin, setuserLogin, userId, userData }}>
      {children}
    </AuthContext.Provider>
  );
}
