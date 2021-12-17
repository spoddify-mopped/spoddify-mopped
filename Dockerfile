FROM node:14 AS builder

# Build Backend
WORKDIR /build/backend

COPY packages/backend/package.json ./

# Install production dependencies and save them for production usage
RUN yarn install --production --pure-lockfile
RUN cp -RL node_modules /tmp/node_modules

# Install all dependencies for build
RUN yarn install --pure-lockfile

COPY packages/backend/src ./src
COPY packages/backend/tsconfig.json ./

RUN yarn build

# Build Frontend
WORKDIR /build/frontend

COPY packages/frontend/package.json ./

RUN yarn install --pure-lockfile

COPY packages/frontend/src ./src
COPY packages/frontend/public ./public
COPY packages/frontend/tsconfig.json ./

RUN yarn build
