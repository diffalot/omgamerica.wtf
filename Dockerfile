FROM mhart/alpine-node:base-6.9.1

WORKDIR /src
ADD . .

EXPOSE 3000
CMD ["node", "index.js"]
