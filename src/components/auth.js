import React from "react";
import { useUserContext } from "../context/userContext";
import { BrowserRouter as Router, Link } from "react-router-dom";

const Authentication = () => {

  const { signInWithGithub } = useUserContext();

  return (
    <div className="container">
      <Router>
     <Link to="/dashboard"><button onClick={signInWithGithub}> Login with GitHub </button></Link>
      </Router>
    </div>
  );
};

export default Authentication;
