# EZ Recipes Web App

[![Node.js CI](https://github.com/Abhiek187/ez-recipes-web/actions/workflows/node.js.yml/badge.svg)](https://github.com/Abhiek187/ez-recipes-web/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/Abhiek187/ez-recipes-web/actions/workflows/codeql.yml/badge.svg)](https://github.com/Abhiek187/ez-recipes-web/actions/workflows/codeql.yml)

<div>
    <img src="src/assets/screenshots/wide/home.png" alt="Home screen" width="600">
    <img src="src/assets/screenshots/wide/recipe-1.png" alt="Pasta With Italian Sausage, recipe heading" width="600">
    <img src="src/assets/screenshots/wide/recipe-3.png" alt="Pasta With Italian Sausage, instructions" width="600">
    <img src="src/assets/screenshots/wide/search-2.png" alt="Searching for pasta with chicken" width="600">
    <img src="src/assets/screenshots/wide/profile.png" alt="Profile screen" width="600">
</div>

## Overview

Cooking food at home is an essential skill for anyone looking to save money and eat healthily. However, learning how to cook can be daunting, since there are so many recipes to choose from. Even when meal prepping, knowing what ingredients to buy, what equipment is required, and the order of steps to make the meal can be hard to remember for many different recipes. Plus, during busy days, it's nice to be able to cook up something quick and tasty.

Introducing EZ Recipes, an app that lets chefs find low-effort recipes that can be made in under an hour, use common kitchen ingredients, and can produce multiple servings. On one page, chefs can view what the recipe looks like, its nutritional qualities, the total cooking time, all the ingredients needed, and step-by-step instructions showing what ingredients and equipment are required per step. Each recipe can be shared so other chefs can learn how to make the same recipes.

Chefs can either find a random recipe or search for one using various filters, including by name, dietary restrictions, spice level, and meal type.

The app features a glossary to easily look up the meaning of common terms found in recipes. This will better assist newer chefs in learning how to cook, prep certain ingredients, and use certain kitchen tools. Think [How to Stock](https://github.com/Abhiek187/how-to-stock), but for cooking food instead of managing finances.

Creating an account is free and unlocks more exciting features for chefs. This includes favoriting, rating, and syncing recipes across the web and mobile apps. For example, chefs can browse recipes on the web app and open them on the mobile app to cook them in the kitchen.

The site can be visited at https://ez-recipes-web.onrender.com/.

## Features

- Single-Page Web Application created using Angular
- TypeScript for type safety and SCSS for enhanced CSS syntax
- Material Design UI
- Responsive and accessible web design
- Best practices for Progressive Web Apps
- Search Engine Optimization (SEO)
- REST APIs to a custom [server](https://github.com/Abhiek187/ez-recipes-server), which fetches recipe information from [spoonacular](https://spoonacular.com/food-api) and MongoDB
- Account management using Firebase Authentication
- Offline data storage using localStorage and IndexedDB
- Automated testing and deployment using CI/CD pipelines in GitHub Actions
- Containerized development and production environments using Docker
- Mermaid to write diagrams as code

## Pipeline Diagrams

### NPM CI

```mermaid
flowchart LR

A(Checkout repository) -->|20.x, 22.x| B(Install Node.js)
B --> C(Install dependencies:<br>npm ci)
C --> D(Lint app:<br>npm run lint)
D --> E(Build app:<br>npm run build --if-present)
E --> F(Run Angular tests:<br>npm test)
```

### CodeQL

```mermaid
flowchart LR

A(Checkout repository) -->|JavaScript| B(Initialize CodeQL)
B --> C(Build code)
C --> D(Perform CodeQL analysis)
```

### Deployment

```mermaid
flowchart LR

A(Merge PR to main) --> B(Auto-Deploy to Render)

subgraph B [Auto-Deploy to Render]
direction TB
C(Install dependencies:<br>npm install) --> D(Build web app:<br>npm run build)
D --> E(Use Brotli compression)
E --> F(Serve website over HTTPS on a global CDN)
F --> G(Invalidate CDN cache)
end
```

Source: [Render](https://render.com/docs/static-sites)

## Installing Locally

1. [Clone](https://github.com/Abhiek187/ez-recipes-web.git) this repo.
2. Run `npm install` to install all the dependencies.
3. Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
4. In a separate terminal, follow the steps to set up the [EZ Recipes server](https://github.com/Abhiek187/ez-recipes-server#installing-locally), so the recipes can be fetched locally.
5. When done, press `Ctrl-C` to stop the server.

### Testing

Run `npm test` to run the unit tests using Karma.

### Linting

Run `npm run lint` to lint the entire app using ESLint.

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Then run `python3 -m http.server -d dist/ez-recipes/browser PORT` to serve the page over a simple HTTP server. (By default, `PORT` is 8000.)

### Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Docker

### Development

1. Build the Docker image: `docker build . -t TAG_NAME`
2. Run the image in a container: `docker run --rm -p 4200:4200 -d TAG_NAME`
3. Open `localhost:4200`

### Production

1. Build the Docker image: `docker build . -t TAG_NAME -f Dockerfile.prod`
2. Run the image in a container: `docker run --rm -p 4200:80 -d TAG_NAME`
3. Open `localhost:4200`

Run `docker kill <container id>` to shut down the image when done. The container ID can be found using `docker ps`.

## Future Updates

EZ Recipes is continuously improving! More features will come in the future to enhance the cooking experience, including (but not limited to):

- An enhanced home page showing any recommended/popular recipes
- Showing additional recipe information, such as allergens

## Related Repos

- [iOS app](https://github.com/Abhiek187/ez-recipes-ios)
- [Android app](https://github.com/Abhiek187/ez-recipes-android)
- [Server](https://github.com/Abhiek187/ez-recipes-server)
