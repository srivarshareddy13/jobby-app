import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsBriefcaseFill} from 'react-icons/bs'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <ul>
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </li>
        <li>
          <Link to="/">
            <h1>Home</h1>
            <AiFillHome />
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <h1>Jobs</h1>
            <BsBriefcaseFill />
          </Link>
        </li>
        <li>
          <FiLogOut onClick={onClickLogout} />
          <button type="button" onClick={onClickLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
