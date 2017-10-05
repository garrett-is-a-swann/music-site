### music-site

# Docker

https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/

# Postgres

sudo apt install postgresql-client-common

sudo apt install postgresql-client-9.5

# Connect to postgres with psql

psql -h localhost -p 5432 -d core -U admin

Password for user admin: 'secr3tp5wd'
psql (9.5.9, server 9.6.5)
WARNING: psql major version 9.5, server major version 9.6.
         Some psql features might not work.
Type "help" for help.

core=# \q

## Postgres database setup

$ docker pull postgres

$ docker run --name core -e POSTGRES_PASSWORD=secr3tp5wd -e POSTGRES_USER=admin -e POSTGRES_DB=core -d -p 5432:5432 postgres

# Docker environment cleanup:

$ docker ps

$ docker kill core

$ docker rm core

