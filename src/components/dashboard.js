import React from "react";
import { useUserContext } from "../context/userContext";
import { BrowserRouter as Router, Link } from "react-router-dom";


const Dashboard = () => {
  const { user, logoutUser } = useUserContext();
  console.log(user);
  return (
    <div>
      <h1>Dashboard </h1>
      {user.photoURL && <img src={user.photoURL} alt='profile pic'/>}
      <h2>Name : {user.displayName}</h2>
      <h2>Email : {user.email}</h2>
      <Router>
      <Link to="/auth">
      <button onClick={logoutUser}>Log out</button>
      </Link>
      </Router>
    </div>
  );
};

export default Dashboard;
