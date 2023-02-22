require('dotenv').config();
const express = require("express");
const notesRouter = require( "./src/routes/notesRoutes" );
const userRouter = require( "./src/routes/userRoutes" );
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/notes", notesRouter);

app.get("/", (req, res) => {
    res.send();
})

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(4000, () => {
        console.log("Server started on port no 4000");
    })
}).catch((error) => console.log(error));