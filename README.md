## Hospitals Nearby.

### Overview

In this COVID world that we live in, it is important that people can easily access medical assistance if need be. With that in mind, the goal of this challenge is to build an application that can locate all the hospitals within a given area. User search results will be persisted in a database and user will be able to see search histories unique to them alone.


### Technologies

These following technologies were used when building this application

- [ReactJS](https://reactjs.org/docs/getting-started.html) and [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Typescript](https://create-react-app.dev/docs/adding-typescript/)
- [Google Maps API](https://developers.google.com/maps/documentation) or [Google Places API](https://developers.google.com/places/web-service/intro) or Any Third Party Location API of Choice
- [AntD](https://ant.design/docs/react/introduce)
- [FireAuth](https://firebase.google.com/docs/auth) or [Auth0](https://auth0.com/docs/quickstarts/)
- [FireStore](https://firebase.google.com/docs/firestore)
- [Firebase Cloud Functons](https://firebase.google.com/docs/functions)
- [Express](https://expressjs.com/)
- [GraphQL](https://graphql.org/)

### Application Requirements

- Users should be able to type into a search bar
- Users should be able to pick a geo-fencing radius for the search results
  - (example - 5km, 10km, 20km etc...)
- Users should be able to search for Hospitals, Pharmacies, Clinics and Medical Offices
- Typing into the search bar generates search results
- User should be able to see the search results
- Users should be able to see past results
  - There should be a place that a user can click to see all the results that have been searched on the app
  - Clicking on a past search result should trigger a request and the results should be displayed for the user.

- Authentication

  - User should be able to signup for the application
  - User should be able to access the application using their email and password
  - User should only be allowed to access the application if they are signed in

- GraphQL
  - Build a GraphQL layer that pulls the users specific search results from your database or API
  - User should only see their own search history


### Installation

- Clone this repository into your local machine:
  
```git
git clone https://github.com/Young-Einstein10/enye.git
```

- Install dependencies:

```git
yarn install or npm install
```

- To start the application:

```git
yarn start or npm start
```

### Deployment

- Live Project is deployed [here](https://enye.now.sh/)

### Contributing

Pull requests are welcome. File an issue for ideas, conversation or feedback.

### Author

- Abdulrahman Yusuf

### License

- This project is licensed under the MIT Public License