const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const expressGraphQL = require("express-graphql");
const schema = require("./schema.js");
const app = express();
const ctrl = require("./controllers");
const PORT = process.env.PORT || 5000;
// Allow cross-origin
app.use(cors());

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  res.send("GraphQL Server Up and Running");
});

// app.get("/users", ctrl.getAllUsers);
// app.post("/user", ctrl.addNewUser);
// app.get("/user/:id", ctrl.getSingleUser);
// app.get("/searches", ctrl.getAllSearches);
// app.post("/search", ctrl.addSearchToDB);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}/graphql`);
});

exports.api = functions.https.onRequest(app);
