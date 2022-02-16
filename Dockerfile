# pull official base image
FROM node:16.13.0

# set working directory
WORKDIR /reasonlabs

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /smc-seo/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install -g sequelize-cli
RUN sequelize-cli db:create
RUN sequelize-cli db:migrate

# add app
#COPY . ./

# start app
#CMD ["npm", "start"]