NAME=staking
VERSION=$$(git rev-parse HEAD)

REGISTRY_SERVER?=registry.videocoin.net
REGISTRY_PROJECT?=cloud

REACT_APP_API_URL?=
REACT_APP_GAS_KEY?=c2babe0568556b4b93165dde81a0348cb5e4eb7d6f07b9f1c0be19add54b
REACT_APP_DELEGATIONS_API_URL?=
REACT_APP_NETWORKS?=
REACT_APP_TOKEN_ADDRESS?=
REACT_APP_ESCROW_ADDRESS?=
REACT_APP_STORE_CONFIG?=

.PHONY: deploy build

default: build

version:
	@echo ${VERSION}

build:
	yarn run build

deps:
	yarn --ignore-optional
	cd src/ui-kit && yarn && cd -

docker-build:
	docker build -t ${REGISTRY_SERVER}/${REGISTRY_PROJECT}/${NAME}:${VERSION} \
	--build-arg REACT_APP_API_URL=${REACT_APP_API_URL} \
	--build-arg REACT_APP_GAS_KEY=${REACT_APP_GAS_KEY} \
	--build-arg REACT_APP_DELEGATIONS_API_URL=${REACT_APP_DELEGATIONS_API_URL} \
	--build-arg REACT_APP_NETWORKS=${REACT_APP_NETWORKS} \
	--build-arg REACT_APP_TOKEN_ADDRESS=${REACT_APP_TOKEN_ADDRESS} \
	--build-arg REACT_APP_ESCROW_ADDRESS=${REACT_APP_ESCROW_ADDRESS} \
	--build-arg REACT_APP_STORE_CONFIG='${REACT_APP_STORE_CONFIG}' \
	-f Dockerfile .

docker-push:
	docker push ${REGISTRY_SERVER}/${REGISTRY_PROJECT}/${NAME}:${VERSION}

release: docker-build docker-push

deploy:
	helm upgrade -i --wait --set image.tag="${VERSION}" -n console staking ./deploy/helm
