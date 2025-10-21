# Fetch the latest LTS version of node
FROM node:25-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Run the Angular app on port 4200 and open the connection
EXPOSE 4200
CMD [ "npm", "start", "--", "--host=0.0.0.0" ]
