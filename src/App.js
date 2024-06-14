import {Component} from 'react'

import Loader from 'react-loader-spinner'

import ProjectItems from './components/ProjectItems'

import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
class App extends Component {
  state = {
    activeId: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getProjectList()
  }

  getProjectList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeCategoryItem = event => {
    this.setState({activeId: event.target.value}, this.getProjectList)
  }

  renderProjectsListView = () => {
    const {projectsList} = this.state
    return (
      <div>
        <ul className="unOrderListContainer">
          {projectsList.map(eachItem => (
            <ProjectItems projectItemDetails={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  onClickRetryButton = () => {
    this.getProjectList()
  }

  renderFailureView = () => (
    <div className="failureViewContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failureHeading">Oops! Something Went Wrong</h1>
      <p className="failureDescription">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="button"
        type="button"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height="50" width="50" color="#4656a1" />
    </div>
  )

  renderSwitchDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()

      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state

    return (
      <div className="app-container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <div className="bottom-container">
          <ul>
            <select
              value={activeId}
              onChange={this.onChangeCategoryItem}
              className="select-style"
            >
              {categoriesList.map(eachItem => (
                <option
                  key={eachItem.id}
                  value={eachItem.id}
                  className="option-style"
                >
                  {eachItem.displayText}
                </option>
              ))}
            </select>
          </ul>

          {this.renderSwitchDetails()}
        </div>
      </div>
    )
  }
}

export default App
