import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

const SimilarItems = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,
    location,
    rating,
    jobDescription,
    title,
  } = details
  return (
    <li>
      <div>
        <img src={companyLogoUrl} alt="similar job company logo" />
        <h1>{title}</h1>
        <AiFillStar />
        <p>{rating}</p>
        <div>
          <h1>Description</h1>
          <p>{jobDescription}</p>
          <MdLocationOn />
          <p>{location}</p>
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}
export default SimilarItems
