#!/bin/sh

start() {
  yarn start
}

build() {
  yarn prebuild && yarn build
}

prod-start() {
  yarn start:prod
}

dev-start() {
  yarn start:dev
}

