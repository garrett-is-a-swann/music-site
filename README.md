### music-site

## Docker
https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/

# Postgres
$ docker pull postgres
$ docker run --name core -e POSTGRES_PASSWORD=secr3tp5wd -e POSTGRES_USER=admin -e POSTGRES_DB=core -d postgres

## Meteor
curl https://install.meteor.com/ | sh
