var React = require("react");

class UserList extends React.Component {
  render() {
    console.log(this);
    return (
      <html>
        <head />
        <body>
          <h1>Your Pokedex</h1>
          <ul>
            {this.props.pokemon.map(pokemon => (
              <li key={pokemon.id}>
                {pokemon.name}
              </li>
            ))}
          </ul>
           <a href={'/pokemon/'+pokemon.id}> <div className="pokemon_img"><img src={pokemon.img}/></div> </a>
          <form className="thumbnail_btn" method="GET" action={'/pokemon/'+pokemon.id+'/edit'}>
            <input id="edit_btn" className="btn" type="submit" value="Edit" />
          </form>
          <form className="thumbnail_btn" method="DELETE" action={'/pokemon/'+pokemon.id+'/delete'}>
            <input id="delete_btn" className="btn" type="submit" value="Delete" />
          </form>

          <form method= 'POST' action= '/users/logout?_method=DELETE'>
          <input name= 'submit' type= 'submit' value='Logout'/>
          </form>
        </body>
      </html>
    );
  }
}

module.exports = UserList;
