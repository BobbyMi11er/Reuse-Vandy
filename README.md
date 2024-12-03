# Reuse-Vandy
Repository for CS 4278 - Principles of Software Engineering Group 15

## Project Inspiration
This is a project designed to replace the antiquated ReuseVandy GroupMe with a user-friendly mobile application.
This will allow for better searching, visibility, and connection between buyers and sellers.

## Framework
We will be using ReactNative for the frontend with a NodeJS backend connected to a MySQL Database, both hosted on AWS.
The app will be hosted on Expo, a framework library for ReactNative.

## Instructions For Use
To use locally:
1. Access zip file provided which contains needed `.env` and other hidden files
2. Go into the `/client` folder
3. Run `npm i` to download frontend dependencies
4. Run `npm test` in client folder to run frontend tests
5. Go to the `/server` folder
6. Run `npm i` to download backend dependencies
7. Run `npm start` to launch local version of server
8. Go back to client folder
9. Change the `EXPO_PUBLIC_BACKEND_URL` in `/client/.env` to "http://YOUR_IP_ADDRESS:BACKEND_SERVER_PORT"
- The port the server is running on will be printed when you run `npm start` in step 7
- You can find your IP address using the command `ipconfig`
10. Run `npm start` in the client folder to launch Expo and bundle the app
11. Scan the printed QR code with your phone, the application will open in ExpoGo

App is not currently deployed on the iOS App Store.


## Git Best Practices
1. A new branch will be created for each portion of the sprint
2. NO WORK WILL BE DONE ON THE MAIN BRANCH
3. All commits will have informative and easy to understand messages
4. PRs will need to be reviewed by at least one other team member
5. Commit early and often, there shouldn't be any pull requests with only one commit

## Requirements Analysis 
[See initial requirements analyis document here](https://drive.google.com/file/d/1oITL9S0OgK37LzIqS5FeMxV5h1pcQ1l8/view?usp=sharing)

## Final Report
[See final report document here](https://drive.google.com/file/d/1-XcQYqKVKwR3Zj1EN4IKNrtLC4NMzPSs/view?usp=sharing)