# Thundernetes UI

This project is a web front end application to manage game servers running in one or more [Thundernetes](https://github.com/PlayFab/thundernetes) clusters. To be able to connect to them, be sure to deploy the [gameserverapi](https://github.com/PlayFab/thundernetes/tree/main/cmd/gameserverapi) on each cluster.

## How to config the app
The app needs a file called ```config.js``` with the endpoints to the [gameserverapi](https://github.com/PlayFab/thundernetes/tree/main/cmd/gameserverapi) and to the [Thundernetes](https://github.com/PlayFab/thundernetes) manager (this is only to allocate game servers). Inside the file you need to define a variable called ```clusters``` with the following structure:

```js
var clusters = {
  "cluster1": {
    "api": "http://{gameserverapi1_IP}:5001/api/v1/",
    "allocate": "http://{manager1_IP}:5000/api/v1/allocate"
  },
  "cluster2": {
    "api": "http://{gameserverapi2_IP}:5001/api/v1/",
    "allocate": "http://{manager2_IP}:5000/api/v1/allocate"
  }
}
 ```

## How to run locally
If you want to run this locally you can create the ```config.js``` file inside the public folder, then you can simply run the app with the ```npm start``` command.

## How to run using the Docker image
You can also run the Docker container image, all you have to do is mount a volume to pass the ```config.js``` file to the app, you can do this like this:
```
docker run -d -p 80:80 -v [path to your config.js]:/usr/share/nginx/html/config.js ghcr.io/playfab/thundernetes-ui:[version]
```

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
