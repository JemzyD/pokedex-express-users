-- create Pokemon table in database
CREATE TABLE IF NOT EXISTS pokemon (
  id SERIAL PRIMARY KEY,
  num varchar(255),
  name varchar(255),
  img varchar(255),
  weight varchar(255),
  height varchar(255),
  user_id int
);

-- create Users table in database
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name varchar(255),
  email varchar(255),
  password varchar(255)
);

CREATE TABLE IF NOT EXISTS user_pokemon (
  id SERIAL PRIMARY KEY,
  pokemon_id int REFERENCES pokemon(id),
  user_id int REFERENCES users(id)
);