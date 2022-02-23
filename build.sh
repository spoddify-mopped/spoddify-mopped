#!/usr/bin/env sh

yarn frontend build
yarn backend build

cp packages/backend/config.example.json ./out
cp packages/backend/package.json ./out
cp packages/backend/swagger.json ./out
cp README.md ./out
