# Reuse-Vandy
Repository for CS 4278 - Principles of Software Engineering Group 15

## Project Inspiration
This is a project designed to replace the antiquated ReuseVandy GroupMe with a user-friendly mobile application.
This will allow for better searching, visibility, and connection between buyers and sellers.

## Framework
We will be using ReactNative for the frontend with a NodeJS backend connected to a relational database (likely Postgress but not finalized yet)
The app will be hosted on Expo, a framework library for ReactNative.

## Installation Instructions
- Because our application is currently under review, beta testers must follow [this link]([url](https://testflight.apple.com/join/HuEqWhHA)) in order to download our application from the app store.

## Deployment Instructions
In order to run a test version of our application in the CLI, follow these steps (requires Xcode):
- Navigate to the /server folder and run ```npm start``` to start the backend server
- Navigate to the /client folder and run ```npm start``` to start the client frontend
- When the dialog pops up in the CLI, click ```i``` to select the iOS simulator, and your simulator should open.

In order to create a build for deployment, follow these steps:
- Navigate to the /client folder and run ```eas build --profile production -p ios``` to start the production build of this app. Follow the CLI prompts to login to your EAS account.
- Run ```eas submit -p ios --latest``` to submit your build to App Store Connect. Follow the CLI prompts to login to your EAS account and Apple Developer account.

## Git Best Practices
1. A new branch will be created for each portion of the sprint
2. NO WORK WILL BE DONE ON THE MAIN BRANCH
3. All commits will have informative and easy to understand messages
4. PRs will need to be reviewed by at least one other team member
5. Commit early and often, there shouldn't be any pull requests with only one commit

## Requirements Analysis 
[See initial requirements analyis document here](https://drive.google.com/file/d/1oITL9S0OgK37LzIqS5FeMxV5h1pcQ1l8/view?usp=sharing)
