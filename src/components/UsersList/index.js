import {Component} from 'react'
import {GrFormPrevious, GrFormNext} from 'react-icons/gr'
import {MdFirstPage, MdLastPage} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import {v4} from 'uuid'
import UserDetails from '../UserDetails'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UsersList extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    totalUsersDataList: [],
    searchInput: '',
    checkBoxes: [],
    currentPage: 1,
  }

  componentDidMount() {
    this.getUsersList()
  }

  getUsersList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      this.setState({
        totalUsersDataList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  goToFirstPage = () => {
    this.setState({currentPage: 1})
  }

  goToPreviousPage = () => {
    const {currentPage} = this.state
    if (currentPage > 1) {
      this.setState(prevState => ({
        currentPage: prevState.currentPage - 1,
      }))
    }
  }

  goToNextPage = () => {
    const {currentPage} = this.state
    const currentUsersList = this.getSearchResults()
    const usersPerPage = 10
    const totalPages = Math.ceil(currentUsersList.length / usersPerPage)
    if (currentPage < totalPages) {
      this.setState(prevState => ({
        currentPage: prevState.currentPage + 1,
      }))
    }
  }

  goToLastPage = () => {
    const currentUsersList = this.getSearchResults()
    const usersPerPage = 10
    const totalPages = Math.ceil(currentUsersList.length / usersPerPage)
    this.setState({currentPage: totalPages})
  }

  getPaginationGroup = () => {
    const currentUsersList = this.getSearchResults()
    const usersPerPage = 10
    const totalPages = Math.ceil(currentUsersList.length / usersPerPage)
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i += 1) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  changePage = event => {
    this.setState({currentPage: Number(event.target.textContent)})
  }

  pagination = () => {
    const {currentPage} = this.state
    return (
      <nav className="pagination">
        <button
          type="button"
          className="pagination-button"
          onClick={this.goToFirstPage}
        >
          <MdFirstPage />
        </button>
        <button
          type="button"
          className="pagination-button"
          onClick={this.goToPreviousPage}
        >
          <GrFormPrevious />
        </button>
        {this.getPaginationGroup().map(item => (
          <button
            type="button"
            key={v4()}
            onClick={this.changePage}
            className={`pagination-button  ${
              currentPage === item ? 'active' : null
            }`}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          className="pagination-button"
          onClick={this.goToNextPage}
        >
          <GrFormNext />
        </button>
        <button
          type="button"
          className="pagination-button"
          onClick={this.goToLastPage}
        >
          <MdLastPage />
        </button>
      </nav>
    )
  }

  deleteUsers = () => {
    const {totalUsersDataList, checkBoxes} = this.state
    let updatedUsersData = [...totalUsersDataList]
    checkBoxes.forEach(eachId => {
      updatedUsersData = updatedUsersData.filter(
        eachUser => eachUser.id !== eachId,
      )
    })
    this.setState({totalUsersDataList: updatedUsersData})
  }

  toggleCheckbox = (value, id) => {
    if (value === true) {
      this.setState(prevState => ({
        checkBoxes: [...prevState.checkBoxes, id],
      }))
    } else {
      this.setState(prevState => ({
        checkBoxes: prevState.checkBoxes.filter(
          eachUserId => eachUserId !== id,
        ),
      }))
    }
  }

  onDeleteUser = id => {
    const {totalUsersDataList} = this.state
    const filteredUsersDataList = totalUsersDataList.filter(
      eachUser => eachUser.id !== id,
    )
    this.setState({totalUsersDataList: filteredUsersDataList})
  }

  getSearchResults = () => {
    const {totalUsersDataList, searchInput} = this.state
    const searchResults = totalUsersDataList.filter(
      eachUser =>
        eachUser.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        eachUser.email.toLowerCase().includes(searchInput.toLowerCase()) ||
        eachUser.role.toLowerCase().includes(searchInput.toLowerCase()),
    )
    return searchResults
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  renderUsersListView = () => {
    const {currentPage} = this.state
    const searchResults = this.getSearchResults()
    const usersPerPage = 10
    const startIndex = currentPage * usersPerPage - usersPerPage
    const endIndex = startIndex + usersPerPage
    const paginationData = searchResults.slice(startIndex, endIndex)
    return (
      <ul className="users-list-container">
        {paginationData.map(eachUserData => (
          <UserDetails
            eachUserDetails={eachUserData}
            key={eachUserData.id}
            onDeleteUser={this.onDeleteUser}
            onEditUser={this.onEditUser}
            toggleCheckbox={this.toggleCheckbox}
          />
        ))}
      </ul>
    )
  }

  onClickRetryButton = () => {
    this.getUsersList()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <h1>Oops! Something Went Wrong</h1>
      <p>
        We are having some trouble to complete your request. Please try again.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="list-loader">
      <Loader type="TailSpin" height={50} width={50} />
    </div>
  )

  renderUsers = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderUsersListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="app-container">
        <div className="responsive-container">
          <input
            type="search"
            placeholder="Search by name, email or role"
            className="search-input"
            onChange={this.onChangeSearchInput}
            value={searchInput}
          />
          <div className="header-container">
            <input type="checkbox" />
            <h1 className="label">Name</h1>
            <h1 className="label">Email</h1>
            <h1 className="label">Role</h1>
            <h1 className="label">Action</h1>
          </div>
          <hr />
          {this.renderUsers()}
          <div className="button-pagination-container">
            <button
              type="button"
              className="delete-selected-button"
              onClick={this.deleteUsers}
            >
              Delete Selected
            </button>
            <div>{this.pagination()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default UsersList
