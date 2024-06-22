import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Loader from 'react-loader-spinner'
import JobItem from '../JobItem'
import {AiOutlineSearch} from 'react-icons/ai'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const apiJobConstants = {
  initial: 'INITAIL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiProfileConstants = {
  initial: 'INITAIL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsDetails: [],
    profileData: {},
    searchInput: '',
    checkboxInput: [],
    salaryInput: '',
    jobStatus: apiJobConstants.initial,
    profileStatus: apiProfileConstants.initial,
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({profileStatus: apiProfileConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(profileUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const profile = data.profile_details
      const fetchedData = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      this.setState({
        profileStatus: apiProfileConstants.success,
        profileData: fetchedData,
      })
    } else {
      this.setState({profileStatus: apiProfileConstants.failure})
    }
  }

  getJobsData = async () => {
    const {salaryInput, checkboxInput, searchInput} = this.state
    this.setState({jobStatus: apiJobConstants.inProgress})
    const type = checkboxInput.join(',')
    const token = Cookies.get('jwt_token')
    const jobUrl = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${salaryInput}&search=${searchInput}`
    const options = {
      header: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(data => ({
        companyLogoUrl: data.company_logo_url,
        employmentType: data.employment_type,
        jobDescription: data.job_description,
        id: data.id,
        packagePerAnnum: data.package_per_annum,
        location: data.location,
        rating: data.rating,
        title: data.title,
      }))
      this.setState({
        jobStatus: apiJobConstants.success,
        jobsDetails: updatedData,
      })
    } else {
      this.setState({jobStatus: apiJobConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearch = () => {
    this.getJobsData()
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onSelectRange = event => {
    this.setState({salaryInput: event.target.id}, this.getJobsData)
  }

  onClickCheckbox = event => {
    const {checkboxInput} = this.state
    if (checkboxInput.includes(event.target.id)) {
      const updatedList = checkboxInput.filter(each => each !== event.target.id)
      this.setState({checkboxInput: updatedList}, this.getJobsData)
    } else {
      this.setState(
        prevState => ({
          checkboxInput: [...prevState.checkboxInput, event.target.id],
        }),
        this.getJobsData,
      )
    }
  }

  renderProfileSuccess = () => {
    const {profileData} = this.state
    const {name, shortBio, profileImageUrl} = profileData

    return (
      <div>
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetryProfile = () => this.getProfileData()

  onRetryJob = () => this.getJobsData()

  renderProfileFailure = () => (
    <div>
      <h1>profile Fail</h1>
      <button type="button" onClick={this.onRetryProfile}>
        Retry
      </button>
    </div>
  )

  renderJobSuccess = () => {
    const {jobsDetails} = this.state
    const noOfJobs = jobsDetails.length > 0

    return noOfJobs ? (
      <div>
        <ul>
          {jobsDetails.map(each => (
            <JobItem key={each.id} details={each} />
          ))}
        </ul>
      </div>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  renderJobFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We could not seem to find the page you are looking for.</p>
      <button type="button" onClick={this.onRetryJob}>
        retry
      </button>
    </div>
  )
  renderProfile = () => {
    const {profileStatus} = this.state

    switch (profileStatus) {
      case apiProfileConstants.success:
        return this.renderProfileSuccess()
      case apiProfileConstants.failure:
        return this.renderProfileFailure()
      case apiProfileConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderJobs = () => {
    const {jobStatus} = this.status
    switch (jobStatus) {
      case apiJobConstants.inProgress:
        return this.renderLoader()
      case apiJobConstants.success:
        return this.renderJobSuccess()
      case apiJobConstants.failure:
        return this.renderJobFailure()
      default:
        return null
    }
  }

  onGetRadioView = () => (
    <ul>
      {salaryRangesList.map(each => (
        <li key={each.salaryRangeId}>
          <input
            type="radio"
            name="option"
            id={each.salaryRangeId}
            onChange={this.onSelectRange}
          />
          <label htmlFor={each.salaryRangeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  onGetCheckbox = () => (
    <ul>
      {employmentTypesList.map(each => (
        <li key={each.employmentTypeId}>
          <input
            id={each.employmentTypeId}
            type="checkbox"
            onChange={this.onClickCheckbox}
          />
          <label htmlFor={each.employmentTypeId}>{each.label}</label>
        </li>
      ))}
    </ul>
  )

  onRenderSearch = () => {
    const {searchInput} = this.state

    return (
      <>
        <input
          type="search"
          value={searchInput}
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearch}
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onSubmitSearch}
        >
          <AiOutlineSearch className="search-icon" />
        </button>
      </>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div>
          <div>{this.onRenderSearch()}</div>
          <div>
            {this.renderProfile()}
            <hr />
            <h1>Type of Employment</h1>
            {this.onGetCheckbox()}
            <hr />
            <h1>Salary Range</h1>
            {this.onGetRadioView()}
          </div>
          <div>
            <div>{this.onRenderSearch()}</div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
