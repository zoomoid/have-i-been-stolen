# have-i-been-stolen

> This project is not maintained anymore and archived, as the underlying bike sharing API is no longer available with
> the data required for this interface to work

`have-i-been-stolen` is a VueJS 2 frontend + PWA implementing Material Design to view Velocity Bike History for the Aachen
area and estimate if it was stolen, as this seems to be a problem.

> No longer hosted. ~~**Try it out live here: <https://haveibeenstolen.zoomoid.de/>**~~

## Build it yourself

```bash
# Version and Docker image tag as variables to re-use later
$ VERSION=1.1
$ DOCKER_TAG=have-i-been-stolen:$VERSION

# Build Docker image from provided Dockerfile
$ docker build -t $DOCKER_TAG .

# Run & deploy the image using docker / docker-compose
docker run --expose 127.0.0.1:8080:80

# Deploy the image using Kubernetes (also see manifests/ directory)
kubectl apply -f manifests/

# Additionally, adapt image to fit to most current version
kubectl set image deployment/have-i-been-stolen have-i-been-stolen=$DOCKER_TAG --record
```
