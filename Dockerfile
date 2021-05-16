# Dockerfile
FROM node:14.15.4

RUN mkdir -p /usr/src/youtube-downloader
WORKDIR /usr/src/youtube-downloader
COPY ./ ./

RUN npm install

WORKDIR /usr/src/youtube-downloader/client
RUN cd /usr/src/youtube-downloader/client

RUN npm install

WORKDIR /usr/src/youtube-downloader

CMD ["npm", "run", "start"]