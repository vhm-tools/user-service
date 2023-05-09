###################
# BUILD FOR DEVELOPMENT
###################

FROM node:18-alpine AS development

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS builder

WORKDIR /usr/app

COPY package.json yarn.lock ./

COPY --from=development /usr/app/node_modules ./node_modules

COPY . .

RUN yarn build

ARG NODE_ENV=production

RUN yarn install --production --frozen-lockfile && yarn cache clean

RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/.env ./.env

CMD ["node", "dist/src/main"]
