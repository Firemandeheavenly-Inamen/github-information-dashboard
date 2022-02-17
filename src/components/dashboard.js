import React, { useState } from "react";
import { useUserContext } from "../context/userContext";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";

const Dashboard = () => {
   const [repositories, setRepositories] = useState([])
  const { user, logoutUser } = useUserContext();
  const [username, setUsername] = useState(user.reloadUserInfo.screenName);
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [organizationName, setOrganizationName] = useState('')
  const [collaborators, setCollaborators] = useState([])
  const [OpenPullRequests, setOpenPullRequests] = useState([])

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
      // console.log(res.data);
      // console.log(res);
    });
    setRepositories([])
    setCollaborators([])
    setOpenPullRequests([])
  }
  function getRepositories(event) {
    let name = event.target.value;
    console.log(name);
    axios({
      method: "get",
      url: `https://api.github.com/users/${name}/repos`,
    }).then((res) => {
      setRepositories(res.data);
      setOrganizationName(name)
      console.log(res.data);
      console.log(res)
    });  
  }

  // function getCollaborators(event) {
  //   let name = event.target.value;
  //   console.log(name);
  //   axios({
  //     method: "get",
  //     url: `https://api.github.com/repos/${organizationName}/${name}/contributors`,
  //   }).then((res) => {
  //     setCollaborators(res.data)
  //     console.log(res.data);
  //     setRepositoryName(name)
  //     });
  // }

  function renderCollaborators(collaborators){
    return(
        <li name='repository-name' className='list-repositories' key={collaborators.id}>
          <p>{collaborators.login}</p>
        </li>
    )
  }

  // function getOpenPullRequests(event) {
  //   let name = event.target.value;
  //   console.log(name);
  //   axios({
  //     method: "get",
  //     url: `https://api.github.com/repos/${organizationName}/${repositoryName}/pulls`,
  //   }).then((res) => {
  //     setOpenPullRequests(res.data)
  //     console.log(res.data);
  //     // console.log(res)
  //   });
  // }  

  async function handleRepositoryClick(event){
    let name = event.target.value;
    const getCollaborators = axios.get(`https://api.github.com/repos/${organizationName}/${name}/contributors`);
    const getOpenPullRequests = axios.get(`https://api.github.com/repos/${organizationName}/${name}/pulls`);
    await axios.all([getCollaborators, getOpenPullRequests]).then(axios.spread(function(res1, res2) {
      setCollaborators(res1.data)
      setOpenPullRequests(res2.data)
    }));
     }

  function renderOpenPullRequests(openPulls){
    return(
        <li name='repository-name' className='list-repositories' key={openPulls.id}>
          <p>{openPulls.title}</p>
        </li>
    )
  }

  function renderRepositories(repositories){
    return(
        <li onClick={handleRepositoryClick} name='repository-name' className='list-repositories' key={repositories.id}>
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
          onClick={getRepositories}
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
        <h2>Organizations</h2>
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
       <h2>Repositories</h2>
          <ul>
            {currentRepositoryPosts.map(renderRepositories)}
          </ul>
        </div>
        <Pagination
        postsPerPage={postsPerRepositoryPage}
        totalPosts={repositories.length}
        paginate={paginateRepositories}
      />

<div className="results-container">
       <h2>Collaborators</h2>
          <ul>
            {collaborators.map(renderCollaborators)}
          </ul>
        </div>

  <div className="results-container">
       <h2>OpenPullRequests</h2>
          <ul>
            {OpenPullRequests.map(renderOpenPullRequests)}
          </ul>
        </div>
       
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
