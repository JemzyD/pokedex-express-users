const React = require('react');

class login extends React.Component {
  render() {

    return (
     <form action="/user/login" method="POST">
        <input type="text" name="name" placeholder="username"/>
        <input type="text" name="password" placeholder="password" />
        <input type="submit" />
      </form>
    )
  }
}

module.exports = login;