import React from "react";
import { useUserContext } from "../context/userContext";
import { BrowserRouter as Router, Link } from "react-router-dom";
import login from '../images/Login.svg'

const Authentication = () => {
  const { error,loading,signInWithGithub } = useUserContext();

  return (
    <div className="landing-page">
      <h1 id='main-heading'>
        <span id="GitHub">GitHub</span>
        <br />
        <span id='h1Down'>
        <span id="Information">Information</span>
        <span id="Dashboard">dashBoard</span>
        </span>
      </h1>
      <p id='githubDescription'>Let us take you into a deeper experience,<br/>
      <span id='secondP'>make a moment a lasting conveyable memory.</span><br/>
      <span id='thirdP'>Let us help build your apps and softwares.</span>
      </p>
      <div className="inner-image">
        <Router>
          <Link to="/dashboard" id="login-button" onClick={signInWithGithub}>
              <img src={login} alt='Login'/>
              <span>Login</span>
          </Link>
        </Router>
      </div>
      {loading && (<h2 style={{color:'white',marginTop:'-9rem'}}>Loading...</h2>)}
      {error && <p className="error">{error}</p>}

    </div>
  );
};

export default Authentication;
