# Build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Production
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Files necessary to run app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/yarn.lock .

COPY --from=builder /usr/src/app/.env .env

ARG SERVER_PORT=3000
ENV SERVER_PORT=$SERVER_PORT

EXPOSE $SERVER_PORT
CMD ["yarn", "run", "start:prod"]