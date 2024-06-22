import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'

const JobItem = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,
    rating,
    title,
    id,
    location,
    jobDescription,
    packagePerAnnum,
  } = details

  return (
    <>
      <Link to={`/jobs/${id}`}>
        <li>
          <div>
            <img src={companyLogoUrl} alt="company logo" />
            <div>
              <h1>{title}</h1>
              <AiFillStar />
              <p>{rating}</p>
            </div>
            <div>
              <MdLocationOn />
              <p>{location}</p>
              <p>{employmentType}</p>
              <div>
                <p>{packagePerAnnum}</p>
              </div>
            </div>
          </div>
          <hr />
          <div>
            <h1>Description</h1>
            <p>{jobDescription}</p>
          </div>
        </li>
      </Link>
    </>
  )
}
export default JobItem
