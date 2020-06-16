// The Firebase Admin SDK to access Cloud Firestore.
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
const firebase = require("firebase");
const dotenv = require("dotenv");

dotenv.config();

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

// admin.initializeApp()
firebase.initializeApp(config);

// const firestore = admin.firestore();
const firestore = firebase.firestore();

const getAllUsers = async () => {
  try {
    let users = [];
    const snapshot = await firestore.collection("users").get();
    snapshot.forEach((doc) =>
      users.push({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(
          doc.data().createdAt.seconds * 1000
        ).toLocaleString(),
      })
    );
    console.log(users);
    return users;
  } catch (error) {
    console.log(error);
    // res.status(500).json({
    //   status: "error",
    //   error,
    // });
    return {
      status: "error",
      error,
    };
  }
};

const getSingleUser = async (userId) => {
  try {
    const snapshot = await firestore.doc(`users/${userId}`).get();

    let userSearches = [];
    const querySnapshot = await firestore.collection("searches").get();
    querySnapshot.docs.forEach((docs) => {
      if (docs.data().user.uid === snapshot.id) {
        userSearches.push({
          id: docs.id,
          ...docs.data(),
          createdOn: new Date(
            docs.data().createdOn.seconds * 1000
          ).toLocaleString(),
        });
      }
    });

    // console.log(userSearches);

    const user = [
      {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: new Date(
          snapshot.data().createdAt.seconds * 1000
        ).toLocaleString(),
        searchHistory: [...userSearches],
      },
    ];
    // res.json(user);
    return user;
  } catch (error) {
    console.log(error);
    // res.status(500).json({
    //   status: "error",
    //   error,
    // });
    return {
      status: "error",
      error,
    };
  }
};

const getAllSearches = async () => {
  try {
    await firestore
      .collection("searches")
      .orderBy("createdOn", "desc")
      .onSnapshot((snapshot) => {
        let pastSearches = [];
        snapshot.docChanges().forEach((element) => {
          if (element.type === "added") {
            pastSearches.push({
              id: element.doc.id,
              address: element.doc.data().address,
              searchType: element.doc.data().searchType,
              radius: element.doc.data().radius,
              ...element.doc.data(),
              createdOn: new Date(
                element.doc.data().createdOn.seconds * 1000
              ).toLocaleString(),
            });
          }
        });
        // res.json(pastSearches);
        return pastSearches;
      });
  } catch (error) {
    console.log(error);
    // res.status(500).json({
    //   status: "error",
    //   error,
    // });
    return {
      status: "error",
      error,
    };
  }
};

const addSearchToDB = async (req, res) => {
  // const {
  //   address,
  //   searchType,
  //   radius,
  //   createdOn,
  //   user: { uid, displayName, email, photoURL },
  // } = req.body;
  try {
    // Using the add method, firestore automatically generates a Document ID
    const docRef = await firestore.collection("searches").add(req.body);
    // After adding a new document, get the newly added document with ID
    const snapshot = await firestore.doc(`searches/${docRef.id}`).get();
    const newSearch = [{ id: snapshot.id, ...snapshot.data() }];
    res.json(newSearch);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      error,
    });
  }
};

const addNewUser = (req, res) => {};

module.exports = {
  getAllSearches,
  getAllUsers,
  getSingleUser,
  addSearchToDB,
  addNewUser,
};
