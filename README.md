# Säätiöbot

Twitter bot for retweeting tweets that contain the suffix "saatio".

## Prerequisites

* [docker](http://docker.io/)
* [docker-compose](https://docs.docker.com/compose/)

## Running

    docker-compose build && docker-compose up

## Deploying

    ansible-playbook ansible/provision.yml -i <hosts-file> -u <user>
