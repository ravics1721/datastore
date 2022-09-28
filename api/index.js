import { config } from "dotenv";
config()
import express from "express";

const app = express();

const port = process.env.PORT || 5050;

app.get("/", (req, res) => {
    res.json({
        message:"Hello There"
    })
});


app.listen(port, ()=>{
    console.log(`[Server]: is running on http://localhost:${port}`);
});

