# Thundernetes Control Panel

This project is a web front end application to manage game servers running in one or more [Thundernetes](https://github.com/PlayFab/thundernetes) clusters. 

## How to run
To be able to connect to them, be sure to deploy the [gameserverapi](https://github.com/PlayFab/thundernetes/tree/main/cmd/gameserverapi) on each cluster. Then you have to define the following environment variable ```REACT_APP_GAMESERVERAPI_URL``` with a JSON like string with the following structure, but on a single line:

```json
REACT_APP_GAMESERVERAPI_URL='{
  "cluster1": {
    "api": "http://{manager_IP}:5001/api/v1/",
    "allocate": "http://{gameserverapi_IP}:5000/api/v1/allocate"
  },
  "cluster2": {
    "api": "http://{manager_IP}:5001/api/v1/",
    "allocate": "http://{gameserverapi_IP}:5000/api/v1/allocate"
  }
}'
 ```
 If you wan to run this locally you can create a file called ```.env.development.local``` in the root of the project and define the environment variable there. Finally you can run the app with the ```npm start``` command.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
