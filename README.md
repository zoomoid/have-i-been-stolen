# have-i-been-stolen

`have-i-been-stolen` is a VueJS frontend + PWA implementing Material Design to view Velocity Bike History for the Aachen
area and estimate if it was stolen, as this seems to be a problem. 

**Try it out live here: <https://haveibeenstolen.zoomoid.de/>**

## Build it yourself?!

Just your usual dockerized VueJS + nginx application:

```bash
# Version and Docker image tag as variables to re-use later
$ VERSION=1.1
$ DOCKER_TAG=have-i-been-stolen:$VERSION

# Build Docker image from provided Dockerfile
$ docker build -t $DOCKER_TAG .

# Run & deploy the image using docker / docker-compose
docker run --expose 127.0.0.1:8080:80 

# Deploy the image using Kubernetes (also see k8s/ directory)
kubectl apply -f k8s/

# Additionally, adapt image to fit to most current version
kubectl set image deployment/have-i-been-stolen have-i-been-stolen=$DOCKER_TAG --record
```
