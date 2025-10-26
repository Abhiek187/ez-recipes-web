# Agent Instructions

## Project Overview

This is an Angular app that lets users learning to cook to search, view, and save a variety of recipes. The UI is designed using Angular Material to be accessible and responsive. It connects to a backend service called EZ Recipes Server that routes all API requests to the appropriate services. The CI/CD pipeline is handled using GitHub Actions. Finally, the app is deployed on Render using Docker. The final Docker image should be as minimal as possible, containing only what's required to host the website. This site can also be installed as a PWA and run offline via service workers.

Before writing any code, review the existing architecture and propose your implementation plan for approval by the user. If something is uncertain, always prefer asking for clarity over making any assumptions. If you're not sure how to implement a solution, it's ok to be honest and admit it to the user.

## Build and Test Commands

Before committing changes, make sure the following commands succeed:

```bash
# Lint
npm run lint
# Build
npm run build
```

In the pipeline, tests are run using a headless Chrome browser. But when running locally, the user will need to run `npm test` manually and open the local server to validate all the tests.

## Code Style Guidelines

This project should follow the latest design patterns and best practices recommended by the Angular team. The Angular CLI is required to generate new components or update Angular dependencies. A new component should be created for every new route. Additional components can be created to break up a large component or make certain sections more reusable.

The website must be designed to be responsive on any device and accessible to all users. Any changes should be compatible across all browsers, including older versions of browsers. On mobile, ensure the keyboard layout is optimized for certain inputs, such as email addresses or numbers. Make sure all HTML elements have the necessary ARIA attributes for accessibility. Follow the best practices for SEO. Additionally, the website needs to be styled for both light and dark modes. The user must validate the styling on their end to make sure the site looks neat and presentable for the end user. Provide some guidance on things to check, such as color contrast or tab navigation via screen readers. Use Google's Lighthouse tool as a reference point for all the best practices a modern website should have. If you're able to analyze screenshots, you may suggest that the user share some screenshots of the app to provide feedback.

TypeScript must be leveraged to mitigate runtime errors. Types shouldn't be bypassed to let the code run. All ESLint rules must be respected when files are saved. Comments can be used to explain more complicated code, but shouldn't be overused if the code is self-explanatory. Make sure test logs and unused imports are removed prior to committing changes. IDE warnings must be kept to a minimum. Commented or unused code should be removed unless the user intends to reference it in the future. Avoid using deprecated code, or replace any existing deprecations. Always consider edge cases when implementing features. Above anything else, make sure the functionality is understandable to someone reading the code.

When you write commit messages, prepend them with 🤖 so it's clear the changes were made with AI. When you raise PRs, make sure to disclose the AI tool used. All changes must be made to a feature branch and then merged to main via a PR.

If you're working on new features that aren't ready for prod yet, utilize feature flags, such as with Angular's guard system, to ensure these changes aren't visible in the final build. Every time the code is merged to main, a new deployment will automatically trigger to update the website. Once the feature flag is ready for prod and well-tested, it should be removed from the code to minimize tech debt.

When working with the user, ensure you follow all guidelines for ethical AI, such as keeping the human in the loop, taking accountability for changes, and being transparent about the thought process and where you retrieve your ideas from.

## Testing Instructions

Helper methods should be unit tested where possible with reasonable coverage. Mock any external dependencies needed for unit tests. When new files are created using the Angular CLI and they include test files, these files should be utilized to test the corresponding feature. Follow the same patterns used in existing test files to ensure the TestBed is set up and utilizing dependency injection.

In addition to running the test command above, ensure the user tests the app running locally on various browsers. Ideally, the user should test that the site works on Chromium, WebKit, and Firefox on both desktop and mobile.

## Security Considerations

This is a frontend app. Therefore, NO secrets should be managed in this repo since anyone can view the source code for a website. Secrets should be delegated to EZ Recipes Server. If the user has to enter sensitive credentials, such as passwords, they should be masked, but provide an option to view what they're entering to ensure they're typing things properly. Consider also if a feature on the website requires the user to be authenticated first. If so, utilize a guard that redirects the user to sign in before redirecting to the page they wanted to visit.

Make sure this website is protected against various malicious attacks, such as XSS, SQL injection, or CSRF. While the server will validate all inputs, it's still good practice to validate inputs on the client side. This way, users can receive immediate feedback on their inputs before sending them to the server.

All API requests and responses should be logged for auditing purposes, but sensitive information like passwords, cookies, or API keys should be masked in the logs. Important transactions can be logged as well, but don't make logs excessive when it comes time to search logs to troubleshoot bugs with the app. If an API errors out, make sure to provide a user-friendly message explaining what went wrong. Don't go into too much technical detail, especially if the error exposes information that would benefit malicious actors, such as if the username is correct, but the password was invalid.

All dependencies should be kept up-to-date to minimize any vulnerabilities. Any new packages added to this project should be regularly updated and not abandoned after several years or contain lingering vulnerabilities. If a feature can be implemented trivially without introducing another dependency, that's preferred.

The user's privacy must be respected. If there are any changes made to the website that impact how the user's data is managed, make sure to update PRIVACY_POLICY.md. This is the same privacy policy the mobile apps reference from the app store, so it's important to make sure it's up-to-date.
