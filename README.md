# Food Findr

This is a small demo for a web app that uses Google Map's API and Foursquare's.

This app allows you to find places to eat near you.  The starting radius of search is 100 meters but you can increase it up to 5 kilometers by using the input control.

## How to run this demo

1) Clone the project:
```
https://github.com/juanfevasquez/FoodFinder.git
```

2) You must have [Node](https://nodejs.org/en/) installed.

Once you have Node, you can run:
```
npm install
```

Node will install your dependencies for this project to run.

3) Create a config.json

In the root folder of this project create a file named config.json.  Inside of it create the same structure provided inside of **config.sample.json**
```
{
    "CLIENT_ID": "Add your foursquare secret user",
    "CLIENT_KEY": "Add your foursquare secret pass"
}
```

4) Get your [Foursquare developer](https://developer.foursquare.com/) secret user and password and paste them in CLIENT_ID and CLIENT_KEY respectively.

5) To start the app in development mode run the following command:
```
npm run develop
```

6) If you just want to run the app:
```
npm start
```

