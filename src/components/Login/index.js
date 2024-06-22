import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showSubmitError: false,
  }
  submitSuccess = token => {
    Cookies.set('jwt_token', token, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg: errorMsg})
  }

  onChangeUsername = event => this.setState({username: event.target.value})

  onChangePassword = event => this.setState({password: event.target.value})

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  render() {
    const {showSubmitError, errorMsg, username, password} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <form onSubmit={this.submitForm}>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <label htmlFor="username">USERNAME</label>
          <br />
          <input
            id="username"
            type="text"
            value={username}
            onChange={this.onChangeUsername}
            placeholder="Username"
          />
          <br />
          <label htmlFor="password">PASSWORD</label>
          <br />
          <input
            id="password"
            type="text"
            value={password}
            placeholder="Password"
            onChange={this.onChangePassword}
          />
          <br />
          <button type="submit">Login</button>
          {showSubmitError && <p>*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
