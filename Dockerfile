FROM oven/bun:alpine

WORKDIR /app

COPY package.json /app

RUN bun install

COPY . /app

RUN bunx prisma generate

EXPOSE 3000

CMD [ "bun", "start" ]