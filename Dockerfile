FROM node:16.14 AS builder

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

ENV DISABLE_ESLINT_PLUGIN=true

RUN yarn build

FROM node:16.14-alpine as runner

WORKDIR /usr/src/app

COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /build/backend/package.json ./
COPY  packages/backend/swagger.json ./
COPY --from=builder /build/backend/dist ./dist/
COPY --from=builder /build/frontend/build ./public/

CMD [ "node", "dist/index.js" ]
