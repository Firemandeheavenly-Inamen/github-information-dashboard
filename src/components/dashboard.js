import React, { useState, useEffect } from "react";
import { useUserContext } from "../context/userContext";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const { user, logoutUser } = useUserContext();
  const [username, setUsername] = useState(user.reloadUserInfo.screenName);
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [organizationName, setOrganizationName] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [openPullRequests, setOpenPullRequests] = useState([]);
  const [closedPullRequests, setClosedPullRequests] = useState([]);
  const [activeBranches, setActiveBranches] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);

  const [currentRepositoryPage, setCurrentRepositoryPage] = useState(1);
  const [postsPerRepositoryPage] = useState(10);

  useEffect(() => {
    clearRepositoryFields();
  }, [organizationName]);

  function handleSubmit(e) {
    e.preventDefault();
    searchOrganizations();
  }

  function clearRepositoryFields() {
    setCollaborators([]);
    setOpenPullRequests([]);
    setClosedPullRequests([]);
    setActiveBranches([]);
  }

  function searchOrganizations() {
    setLoading(true);
    axios({
      method: "get",
      url: `https://api.github.com/users/${username}/orgs`,
    }).then((res) => {
      setLoading(false);
      setOrganizations(res.data);
    });
    setRepositories([]);
    setCollaborators([]);
    setOpenPullRequests([]);
    setClosedPullRequests([]);
  }
  function getRepositories(event) {
    let name = event.target.value;
    console.log(name);
    axios({
      method: "get",
      url: `https://api.github.com/users/${name}/repos?page=1&per_page=1000`,
    }).then((res) => {
      setRepositories(res.data);
      setOrganizationName(name);
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

  async function handleRepositoryClick(event) {
    let name = event.target.value;
    const getCollaborators = axios.get(
      `https://api.github.com/repos/${organizationName}/${name}/contributors?page=1&per_page=1000`
    );
    const getOpenPullRequests = axios.get(
      `https://api.github.com/repos/${organizationName}/${name}/pulls?page=1&per_page=1000`
    );
    const getClosedPullRequests = axios.get(
      `https://api.github.com/repos/${organizationName}/${name}/pulls?&state=closed?page=1&per_page=1000`
    );
    const getActiveBranches = axios.get(
      `https://api.github.com/repos/${organizationName}/${name}/branches?page=1&per_page=1000`
    );
    await axios
      .all([getCollaborators, getOpenPullRequests, getClosedPullRequests, getActiveBranches])
      .then(
        axios.spread(function (res1, res2, res3, res4) {
          setCollaborators(res1.data);
          setOpenPullRequests(res2.data);
          setClosedPullRequests(res3.data);
          setActiveBranches(res4.data)
        })
      );
  }

  function renderCollaborators(collaborators) {
    return (
      <li className="list-repositories" key={collaborators.id}>
        <p>{collaborators.login}</p>
      </li>
    );
  }

  function renderOpenPullRequests(openPulls) {
    return (
      <li className="list-repositories" key={openPulls.id}>
        <p>{openPulls.title}</p>
      </li>
    );
  }

  function renderClosedPullRequests(closedPulls) {
    return (
      <li className="list-repositories" key={closedPulls.id}>
        <p>{closedPulls.title}</p>
      </li>
    );
  }

  function renderActiveBranches(activeBranches) {
    return (
      <li className="list-repositories" key={activeBranches.id}>
        <p>{activeBranches.name}</p>
      </li>
    );
  }

  function renderRepositories(repositories) {
    return (
      <li
        onClick={handleRepositoryClick}
        className="list-repositories"
        key={repositories.id}
      >
        <input
          type="button"
          value={repositories.name}
          className="repository-name"
        />
      </li>
    );
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

  const indexOfLastRepositoryPost =
    currentRepositoryPage * postsPerRepositoryPage;
  const indexOfFirstRepositoryPost =
    indexOfLastRepositoryPost - postsPerRepositoryPage;
  const currentRepositoryPosts = repositories.slice(
    indexOfFirstRepositoryPost,
    indexOfLastRepositoryPost
  );
  const paginateRepositories = (pageNumber) =>
    setCurrentRepositoryPage(pageNumber);

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
            <ul>{currentPosts.map(renderOrganization)}</ul>
          </div>
        </div>

        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={organizations.length}
          paginate={paginate}
        />
        <div className="results-container">
          <h2>Repositories</h2>
          <ul>{currentRepositoryPosts.map(renderRepositories)}</ul>
        </div>
        <Pagination
          postsPerPage={postsPerRepositoryPage}
          totalPosts={repositories.length}
          paginate={paginateRepositories}
        />

        <div className="results-container">
          <h2>Collaborators</h2>
          <ul>{collaborators.map(renderCollaborators)}</ul>
        </div>

        <div className="results-container">
          <h2>Active Branches</h2>
          <ul>{activeBranches.map(renderActiveBranches)}</ul>
        </div>

        <div className="results-container">
          <h2>Open Pull Requests</h2>
          <ul>{openPullRequests.map(renderOpenPullRequests)}</ul>
        </div>

        <div className="results-container">
          <h2>Closed Pull Requests</h2>
          <ul>{closedPullRequests.map(renderClosedPullRequests)}</ul>
        </div>
      </div>
      <Router>
        <Link to="/auth">
          <button id="logout" onClick={logoutUser}>
            Log out
          </button>
        </Link>
      </Router>
    </>
  );
};

export default Dashboard;
