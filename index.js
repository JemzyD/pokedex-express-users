/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const methodOverride = require('method-override');
const sha256 = require('js-sha256');
const cookieParser = require('cookie-parser');
const pg = require('pg');

// Initialise postgres client
const config = {
  user: 'jemimalim',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

if (config.user === 'ck') {
	throw new Error("====== UPDATE YOUR DATABASE CONFIGURATION =======");
};

const pool = new pg.Pool(config);

pool.on('error', function (err) {
  console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

 const getRoot = (request, response) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  //
  const queryString = 'SELECT * from pokemon'

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error:', err.stack);
    } else {
      console.log('query result:', result);
      if (request.query.sortby === 'name') {
          result.rows.sort(function(a, b) {
            return ( a.name.toLowerCase() < b.name.toLowerCase() ) ? -1 : ( a.name.toLowerCase() > b.name.toLowerCase() ) ? 1 : 0;
          })
      } else {
          result.rows.sort(function(a, b) {
            return ( parseInt(a.id) < parseInt(b.id) ) ? -1 : ( parseInt(a.id) > parseInt(b.id) ) ? 1 : 0;
          })
      }

      response.render('home', {pokemon : result.rows});

      // redirect to home page
      // response.send( result.rows );
    }
  });

};

const getNew = (request, response) => {
  response.render('new');
}

const getPokemon = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render('pokemon', {pokemon: result.rows[0]});
    }
  });
}

const postPokemon = (request, response) => {
  let params = request.body;
  
  const queryString = 'INSERT INTO pokemon(name, height) VALUES($1, $2);';
  const values = [params.name, params.height];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
};

const editPokemonForm = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'edit', {pokemon: result.rows[0]} );
    }
  });
}

const updatePokemon = (request, response) => {
  let id = request.params['id'];
  let pokemon = request.body;
  const queryString = 'UPDATE "pokemon" SET "num"=($1), "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($6)';
  const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];
  console.log(queryString);
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
}

const deletePokemonForm = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = $1';
  const values = [id];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);
      response.render('delete', {pokemon: result.rows[0]});
    }
  });
}

const deletePokemon = (request, response) => {
  let id = request.params['id'];
  const queryString = 'DELETE FROM pokemon WHERE id = $1';
  const values = [id];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);
      response.render('delete', {pokemon: result.rows[0]});
    }
  });
}

// user stuff

// const details = (request, response) => {

//   let userId = request.cookies['user_id'];

//   if (userId === undefined) {
//     response.send('create account or login first!')

//   } else {

//     const queryString = "SELECT pokemon.* FROM users INNER JOIN users_pokemon ON (users_pokemon.user_id = users.id) \
//        INNER JOIN pokemon ON (users_pokemon.pokemon_id = pokemon.id)\
//        WHERE users_pokemon.user_id =" + userId + " ORDER BY id";

//     pool.query(queryString, (err, result) => {

//       response.render('detailList', {pokemon: result.rows})
//     })
//   }
// }


const createUserForm = (request, response) => {
  response.render('createUser');
}

const createUser = (request, response) => {
  let hashed = sha256(request.body.password);

  const queryString = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)'
  const values = [request.body.name, request.body.email, hashed];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);
      response.redirect('/user/login');
      // response.redirect('/user/detailList');
    }
  });
}

const loginForm = (request, response) => {
  response.render('userLogin');
}

const login = (request, response) => {
  let hashed = sha256(request.body.password);

  const queryString = 'SELECT * FROM users WHERE name = $1';
  const values = [request.body.name];

  pool.query(queryString, values, (err, result) => {
    if (err) {
        console.error('Query error:', err.stack);
    } else {
        if (hashed === result.rows[0].password) {
            let login = 'true';
            let user_id = result.rows[0].id;

            response.cookie('login', login);
            response.cookie('user_id', user_id);

            response.redirect('/');
            // response.redirect('/user/detailList');
        } else {
            response.status(401).send('Authentication Error');
        }
    }
  })
}

const logout = (request, response) => {
  if (request.cookies['login'] !== 'true') {
    response.redirect('/');
    return;
  }

  response.clearCookie('login');
  response.clearCookie('user_id');
  response.redirect('/');
}


const details = (request, response) => {

  let userId = parseInt(request.cookies['user_id']);

  const queryString = 'SELECT * FROM pokemon WHERE user_id = $1;';
  const values = [userId];

   pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } 
    else {
      response.render('detailList', {pokemon: result.rows});
    };
  });
};

// const details = (request, response) => {

//     let userId = request.params.id;

//     const queryString = 'select users.email, users.id, users.name, pokemon.name FROM ((user_pokemons\
//         INNER JOIN pokemon ON user_pokemons.pokemon_id = pokemon.id)\
//         INNER JOIN users ON user_pokemons.user_id = users.id)\
//         WHERE users.id = ' + id;

//         pool.query(queryString, (err, queryResult) => {
//           if (err) {
//             console.log('query error:', err.stack);
//           } else {
//       let context = {
//       user: queryResult.rows[0],
//       pokemon: queryResult.rows
//     }
//     response.render('detailList', context);

//   }
// });
// };






/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon/:id/delete', deletePokemonForm);

app.post('/pokemon', postPokemon);

app.put('/pokemon/:id', updatePokemon);

app.delete('/pokemon/:id', deletePokemon);

// TODO: New routes for creating users
app.get('/user/new', createUserForm);
app.post('/user/new', createUser);

app.get('/user/login', loginForm);
app.post('/user/login', login);

app.get('/user/logout', logout);
app.get('/user/list', details);;

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
  console.log('Recalling all ships to harbour...');
  server.close(() => {
    console.log('... all ships returned...');
    pool.end(() => {
      console.log('... all loot turned in!');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);


