import Cookies from 'js-cookie'
import {Component} from 'react'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import SimilarItems from '../SimilarItems'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: [],
    similarData: [],
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiConstants.inProgress})

    const token = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      header: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const fetchedData = [data.job_details].map(each => ({
        companyLogoUrl: each.company_logo_url,
        companyWebsiteUrl: each.company_website_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        location: each.location,
        skills: each.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          imageUrl: each.life_at_company.image_url,
          description: each.life_at_company.description,
        },
        title: each.title,
      }))
      const updatedData = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
        id: each.id,
      }))
      this.setState({
        apiStatus: apiConstants.success,
        jobData: fetchedData,
        similarData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryJob = () => this.getJobsDetails()

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We could not seem to find the page you are looking for.</p>
      <button type="button" onClick={this.onClickRetryJob}>
        retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {jobData, similarData} = this.state
    if (jobData.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        rating,
        id,
        location,
        skills,
        jobDescription,
        lifeAtCompany,
        packagePerAnnum,
        title,
      } = jobData[0]

      return (
        <>
          <div className="job-item-container">
            <div className="first-part-container">
              <div className="img-title-container">
                <img
                  className="company-logo"
                  src={companyLogoUrl}
                  alt="job details company logo"
                />
                <div className="title-rating-container">
                  <h1 className="title-heading">{title}</h1>
                  <div className="star-rating-container">
                    <AiFillStar className="star-icon" />
                    <p className="rating-text">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-package-container">
                <div className="location-job-type-container">
                  <div className="location-icon-location-container">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{location}</p>
                  </div>
                  <div className="employment-type-icon-employment-type-container">
                    <p className="job-type">{employmentType}</p>
                  </div>
                </div>
              </div>
              <div className="package-container">
                <p className="package">{packagePerAnnum}</p>
              </div>
            </div>
            <hr className="item-hr-line" />
            <div className="second-part-container">
              <div className="description-visit-container">
                <h1 className="description-job-heading">Description</h1>
                <a className="visit-anchor" href={companyWebsiteUrl}>
                  Visit <BiLinkExternal />{' '}
                </a>
              </div>
              <p className="description-para">{jobDescription}</p>
            </div>
            <h1>Skills</h1>
            <ul className="ul-job-details-container">
              {skills.map(each => (
                <li className="li-job-details-container" key={each.name}>
                  <img
                    className="skill-img"
                    src={each.imageUrl}
                    alt={each.name}
                  />
                  <p>{each.name}</p>
                </li>
              ))}
            </ul>
            <div className="company-life-img-container">
              <div className="life-headind-para-container">
                <h1>Life At Company</h1>
                <p>{lifeAtCompany.description}</p>
              </div>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>

          <h1 className="similar-job-heading">Similar Jobs</h1>
          <ul className="similar-jobs-ul-container">
            {similarData.map(each => (
              <SimilarItems
                key={each.id}
                details={each}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  renderDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.failure:
        return this.renderFailure()
      case apiConstants.success:
        return this.renderSuccess()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderDetails()}</div>
      </>
    )
  }
}
export default JobItemDetails
