const express = require("express");
require("./database/db");

const usersRoutes = require("./routes/usersRoutes");
const audiosRoutes = require("./routes/audiosRoutes");
const jobsRoutes = require("./routes/jobsRoutes");
const summariesRoutes = require("./routes/summariesRoutes");

const app = express();
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/audios", audiosRoutes);
app.use("/jobs", jobsRoutes);
app.use("/summaries", summariesRoutes);

app.get("/", (req, res) => {
    res.send("Distributed Audio Summarization Platform backend is running");
});

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});