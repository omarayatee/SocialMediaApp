import { useContext } from "react";
import ProfileCard from "../ProfileCard/ProfileCard";
import Loader from "../Loader/Loader";
import { AuthContext } from "../../Context/AuthContext";

export default function Profile() {
  const { userData } = useContext(AuthContext);

  if (!userData) {
    return <Loader />;
  }

  return (
    <ProfileCard user={userData} />
  );
}
