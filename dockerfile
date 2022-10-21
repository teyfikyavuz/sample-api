FROM node:16
COPY . .
WORKDIR /app
RUN npm install
EXPOSE 8081
CMD ["npm", "start"]