import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Components/Loader/Loader";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {

  const [userToken, setUserToken] = useState(() => localStorage.getItem("userToken"));
  const [userId, setUserId] = useState(null);

  // decode token
  useEffect(() => {
    if (userToken) {
      const decoded = jwtDecode(userToken);
      setUserId(decoded.user);
    }
  }, [userToken]);

  // get user profile
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
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return res.data.data.user;
    },
    enabled: !!userToken,
  });

  if (isLoading) return <Loader />;
  if (isError) return <h2>{error.message}</h2>;

  return (
    <AuthContext.Provider
      value={{
        userToken,
        setUserToken,
        userId,
        userData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
