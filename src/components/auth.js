import React from "react";
import { useUserContext } from "../context/userContext";

const Authentication = () => {

  const { signInWithGithub } = useUserContext();

  return (
    <div className="container">
      <button onClick={signInWithGithub}> Login with GitHub </button>
    </div>
  );
};

export default Authentication;
