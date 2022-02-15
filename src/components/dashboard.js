import React, {useState} from "react";
import { useUserContext } from "../context/userContext";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";


const Dashboard = () => {
  const { logoutUser } = useUserContext();
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState([])

  function handleSubmit(e){
    e.preventDefault()
    searchOrganizations();
  }

  function searchOrganizations(){
    setLoading(true);
    axios({method : 'get',
    url: `https://api.github.com/users/${username}/orgs`
    }).then(res => {
      setLoading(false)
      setOrganizations(res.data);
      console.log(res.data)
      console.log(res)
    })
  }
  function renderOrganization(organization){
    return(
      <div className="row" key={organization.id}>
        <h2 className="organization-name">
          {organization.login}
        </h2>
      </div>
    )
  }
  return (
    <div>
      <div className="">
      <div className="">
      <div className="">
      <input className="input"
      value={username}
      placeholder = 'Github Username'
      onChange={e =>setUsername(e.target.value)} 
      />
      <button className="button" onClick={handleSubmit}>{loading? "Searching..." : "Search"} </button>
      </div>
      <div className="results-container">
        {organizations.map(renderOrganization)}
      </div>
      </div>
      </div>

      <Router>
      <Link to="/auth">
      <button onClick={logoutUser}>Log out</button>
      </Link>
      </Router>
    </div>
  );
};

export default Dashboard;
