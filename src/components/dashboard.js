import React, {useState} from "react";
import { useUserContext } from "../context/userContext";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";


const Dashboard = () => {
  const { logoutUser } = useUserContext();
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState([])
  
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);



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
      <ul className='list-group mb-2' key={organization.id}>
        <li  className='list-group-item'>
          {organization.login}
        </li>
      </ul>
    )
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = organizations.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="">
      <div className="">
      <div className="container mt-5">
      <input className="input"
      value={username}
      placeholder = 'Github Username'
      onChange={e =>setUsername(e.target.value)} 
      />
      <button className="button" onClick={handleSubmit}>{loading? "Searching..." : "Search"} </button>
      </div>
      <div className="results-container">
        {currentPosts.map(renderOrganization)}
      </div>
      </div>
      </div>

      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={organizations.length}
        paginate={paginate}
      />

      <Router>
      <Link to="/auth">
      <button onClick={logoutUser}>Log out</button>
      </Link>
      </Router>
    </div>
  );
};

export default Dashboard;
