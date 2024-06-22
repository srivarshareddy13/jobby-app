import Header from '../Header'
import {Link} from 'react-router-dom'

const Home = props => {
  const onClickFindJobs = () => {
    const {history} = props
    history.push('/jobs')
  }

  return (
    <div>
      <Header />
      <div>
        <h1>
          Find The Job That <br /> Fits Your Life
        </h1>
        <p>
          Millions of people searching for jobs,salary information, company
          reviews.Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" onClick={onClickFindJobs}>
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}
export default Home
