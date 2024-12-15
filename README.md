# Matcha

# How to run
To run the app, create a `.env` file at the root of the project. Then, run `docker-compose up -d`.

docker-compose up -d --force-recreate

# Suprimer et relancer volume db

docker-compose down -v
docker-compose up --build