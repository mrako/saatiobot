# Säätiöbot

Twitter bot for retweeting tweets that contain the suffix "saatio".

## Prerequisites

* [docker](http://docker.io/)
* [docker-compose](https://docs.docker.com/compose/)

## Running

    docker-compose build && docker-compose up

## Deploying

    ansible-playbook ansible/provision.yml -i <hosts-file> -u <user>


## Rancher

### Build

    dc build

### Tag

    docker tag saatiobot_saatiobot mrako/saatiobot

### Push to registry

    docker push mrako/saatiobot

### Upgrade

    rancher-compose -f docker-compose.swarm.yml up --force-upgrade --pull

### Confirm

    rancher-compose -f docker-compose.swarm.yml up --confirm-upgrade

### Rollback

    rancher-compose -f docker-compose.swarm.yml up --rollback

