import React, { useState } from "react";
import { useUserContext } from "../context/userContext";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";

const Dashboard = () => {
   const [repositories, setRepositories] = useState([])
  let { logoutUser } = useUserContext();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);

  const [currentRepositoryPage, setCurrentRepositoryPage] = useState(1);
  const [postsPerRepositoryPage] = useState(3);

  function handleSubmit(e) {
    e.preventDefault();
    searchOrganizations();
  }

  function searchOrganizations() {
    setLoading(true);
    axios({
      method: "get",
      url: `https://api.github.com/users/${username}/orgs`,
    }).then((res) => {
      setLoading(false);
      setOrganizations(res.data);
      console.log(res.data);
      console.log(res);
    });
    setRepositories([])
  }
  function getRepos(event) {
    let name = event.target.value;
    console.log(name);
    axios({
      method: "get",
      url: `https://api.github.com/users/${name}/repos`,
    }).then((res) => {
      setRepositories(res.data);
      console.log(res.data);
    });  
  }
  function renderRepositories(repositories){
    return(
        <li name='repository-name' className='list-repositories' key={repositories.id}>
          <input type='button' value={repositories.name}  className="repository-name" />
        </li>
    )
  }

  function renderOrganization(organization) {
    return (
      <li
        name="organization-name"
        className="list-organization"
        key={organization.id}
      >
        <input
          type="button"
          value={organization.login}
          onClick={getRepos}
          className="organization-name"
        />
      </li>
    );
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = organizations.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastRepositoryPost = currentRepositoryPage * postsPerRepositoryPage;
  const indexOfFirstRepositoryPost = indexOfLastRepositoryPost - postsPerRepositoryPage;
  const currentRepositoryPosts = repositories.slice(indexOfFirstRepositoryPost, indexOfLastRepositoryPost);
  const paginateRepositories = (pageNumber) => setCurrentRepositoryPage(pageNumber);

  return (
    <>
    <div>
      <div className="">
        <div className="container mt-5">
          <input
            className="input"
            value={username}
            placeholder="Github Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="button" onClick={handleSubmit}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        <div className="results-container">
          <ul>
            {currentPosts.map(renderOrganization)}
          </ul>
        </div>
      </div>

      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={organizations.length}
        paginate={paginate}
      />
       <div className="results-container">
          <ul>
            {currentRepositoryPosts.map(renderRepositories)}
          </ul>
        </div>
        <Pagination
        postsPerPage={postsPerRepositoryPage}
        totalPosts={repositories.length}
        paginate={paginateRepositories}
      />

      </div>
      <Router>
      <Link to="/auth">
        <button id="logout" onClick={logoutUser}>Log out</button>
      </Link>
    </Router>
    </>
  );
};

export default Dashboard;
