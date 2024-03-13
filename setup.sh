#! /bin/bash

sudo mkdir -p /mnt/media/traefik
sudo touch /mnt/media/traefik/acme.json
sudo chmod 600 /mnt/media/traefik/acme.json
docker network create traefik
