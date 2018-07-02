const React = require('react');

class NewUser extends React.Component {
  render() {
    
    return (
      <form action="/user/new" method="POST">
        <input type="text" name="name" placeholder="username"/>
        <input type="text" name="email" placeholder="email" />
        <input type="text" name="password" placeholder="password" />
        <input type="submit" />
      </form>
    )
  }
}

module.exports = NewUser;
