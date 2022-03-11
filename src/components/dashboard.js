/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useUserContext } from "../context/userContext";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";
import PieChart from "./PieChart";

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
  const [allBranches, setAllBranches] = useState([]);
  const [userData, setUserData] = useState({});
  let comparativeContributors = [];
  let comparativeContributions = [];
  let personalContributor = "";
  let personalContribution = "";
  let highestContributor = "";
  let highestContribution = "";
  let realActiveBranches = [];
  const [finalActiveBranches, setFinalActiveBranches] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);

  const [currentRepositoryPage, setCurrentRepositoryPage] = useState(1);
  const [postsPerRepositoryPage] = useState(10);

  let contributors = [];
  let contributions = [];

  useEffect(() => {
    if (allBranches.length > 0) {
      allBranches.forEach((branch) => {
        axios({
          method: "get",
          url: branch.commit.url,
        }).then((res) => {
          var today = new Date();
          var date =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();
          const lastCommit = new Date(res.data.commit.author.date);
          const lastCommitDate =
            lastCommit.getFullYear() +
            "-" +
            (lastCommit.getMonth() + 1) +
            "-" +
            lastCommit.getDate();
          var d1 = new Date(date);
          var d2 = new Date(lastCommitDate);
          const diff = Math.abs(d1 - d2);
          const days = diff / (1000 * 3600 * 24);
          if (days < 120) {
            realActiveBranches.push(branch);
            realActiveBranches.sort((a, b) => a.name.localeCompare(b.name))
            setFinalActiveBranches([...realActiveBranches]);
          }
        });
      });
    }
  }, [allBranches,repositories]);

  useEffect(() => {
    axios({
      method: "get",
      url: `https://api.github.com/users/${username}/orgs`,
    }).then((res) => {
      setOrganizations(res.data);
    });
  }, []);

  useEffect(() => {
    clearRepositoryFields();
  }, [organizationName]);

  function handleSubmit(e) {
    e.preventDefault();
    searchOrganizations();
  }

  useEffect(() => {
    getCommitsInfo();
  }, [collaborators]);

  useEffect(() => {
    if (collaborators.length > 0) {
      highestContribution = Math.max(...contributions);
      highestContributor =
        contributors[contributions.indexOf(highestContribution)];
      personalContributor = username;
      personalContribution = contributions[contributors.indexOf(username)];
      comparativeContributors = [personalContributor, highestContributor];
      comparativeContributions = [personalContribution, highestContribution];
    }
    setUserData({
      labels: comparativeContributors,
      datasets: [
        {
          data: comparativeContributions,
          backgroundColor: ["#00B6BD", "#BBFFF6"],
          hoverBackgroundColor: ['#74C5F7', '#0CE0F5'],
          borderColor: "#1B400F",
          borderWidth: 2,
        },
      ],
    });
  }, [collaborators, username]);

  function clearRepositoryFields() {
    setCollaborators([]);
    setOpenPullRequests([]);
    setClosedPullRequests([]);
    setAllBranches([]);
    setFinalActiveBranches([]);
  }

  function searchOrganizations() {
    setLoading(true);
    axios({
      method: "get",
      url: `https://api.github.com/users/${username}/orgs`,
    })
      .then((res) => {
        setLoading(false);
        setOrganizations(res.data);
      })
      .catch((err) => {
        setLoading(false);
      });
    setRepositories([]);
    setCollaborators([]);
    setOpenPullRequests([]);
    setClosedPullRequests([]);
    setAllBranches([]);
  }
  function getRepositories(event) {
    let name = event.target.value;
    axios({
      method: "get",
      url: `https://api.github.com/users/${name}/repos?page=1&per_page=1000`,
    }).then((res) => {
      setRepositories(res.data);
      setOrganizationName(name);
    });
  }

  async function handleRepositoryClick(event) {
    setFinalActiveBranches([])
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
      .all([
        getCollaborators,
        getOpenPullRequests,
        getClosedPullRequests,
        getActiveBranches,
      ])
      .then(
        axios.spread(function (res1, res2, res3, res4) {
          setCollaborators(res1.data);
          setOpenPullRequests(res2.data);
          setClosedPullRequests(res3.data);
          setAllBranches(res4.data);
        })
      );
  }

  function renderCollaborators(collaborators) {
    return (
      <li className="list" key={collaborators.id}>
        <p>|| {collaborators.login} ||</p>
      </li>
    );
  }

  function getCommitsInfo() {
    if (collaborators.length !== 0) {
      for (let i = 0; i < collaborators.length; i++) {
        contributors.push(collaborators[i].login);
        contributions.push(collaborators[i].contributions);
      }
    } else {
      return;
    }
  }

  function renderOpenPullRequests(openPulls) {
    return (
      <li className="list" key={openPulls.id}>
        <p>|| {openPulls.title} ||</p>
      </li>
    );
  }

  function renderClosedPullRequests(closedPulls) {
    return (
      <li className="list" key={closedPulls.id}>
        <p>|| {closedPulls.title} ||</p>
      </li>
    );
  }

  function renderActiveBranches(activeBranches) {
    return (
      <li className="list" key={activeBranches.commit.url}>
        <p>|| {activeBranches.name} ||</p>
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

  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
              size: 14
          }
      },
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <>
      <div>
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
          <ul>{finalActiveBranches.map(renderActiveBranches)}</ul>
        </div>

        <div className="results-container">
          <h2>Open Pull Requests</h2>
          <ul>{openPullRequests.map(renderOpenPullRequests)}</ul>
        </div>

        <div className="results-container">
          <h2>Closed Pull Requests</h2>
          <ul>{closedPullRequests.map(renderClosedPullRequests)}</ul>
        </div>

        <div className="results-container">
        <h2>Comparison Chart</h2>
        {collaborators.length > 0 && (
          <div id="pie-chart">
            <PieChart chartData={userData} chartOptions={options} />
          </div>
        )}
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
