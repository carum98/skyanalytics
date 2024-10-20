# Docker

## Network
The containers are connected to a network called `skyanalytics-network`, and don't expose any port to the host machine.

## Environments
This monorepo uses Docker to run the `deveplopment` and `production` environments.

### Production
To run the production environment, in the root of the project needs to set `COMPOSE_PROFILES=prod` and join the `.env` files in the root of the project. To run the production environment using `docker-compose`, run the following command:
```bash
docker compose -f docker-compose.yml up
```

To expose the ports from the containers define in the `.env` `PORT_BACKEND`, `PORT_FRONTEND` and `PORT_FRONTEND_NITRO`.

### Development
To run the development environment, can use `.devcontainer` or `docker-compose`. In both cases, the development environment will be set up `/packages/frontend/.env`, `/packages/backend/.env` and in the root of the project needs to set `COMPOSE_PROFILES=dev`

#### .devcontainer
The `.devcontainer` is a configuration file for Visual Studio Code to run the development environment. To use it, open the project in Visual Studio Code and click in the `Reopen in Container` button.

#### docker-compose
To run the development environment using `docker-compose`, run the following command:
```bash
docker compose -f docker-compose.yml -f .devcontainer/docker-compose.yml up
```

### Nginx
In the development environment, starts an Nginx container to simulate the production environment.

The Nginx container exposes the ports `81` and `443` to the host machine, this permits to access with `https` and `http` to the frontend and backend.

To generate the certificates, run the following command inside the .devcontainer/certs folder:
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx.key -out nginx.crt
```