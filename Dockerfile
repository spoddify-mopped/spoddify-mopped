FROM node:16.14 AS builder

WORKDIR /build

COPY package.json ./
COPY ui/package.json ./ui/

# Install build dependencies
RUN yarn install --frozen-lockfile
RUN yarn install:ui --frozen-lockfile

COPY src ./src
COPY tsconfig.json ./

COPY ui/src ./ui/src
COPY ui/public ./ui/public
COPY ui/tsconfig.json ./ui/

ENV DISABLE_ESLINT_PLUGIN=true

RUN yarn build

FROM node:16.14-alpine as runner

WORKDIR /usr/src/app

COPY --from=builder /build/package.json ./

RUN yarn install --production --frozen-lockfile

COPY  swagger.json ./

COPY --from=builder /build/dist ./dist/
COPY --from=builder /build/public ./public/

CMD [ "node", "dist/index.js" ]
