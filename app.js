const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const helmet = require("helmet");

app.use(express.urlencoded({extended : true}))
app.set('trust proxy', 1);
app.use(cors());
app.use(helmet());


app.get('/', (req, res) => {

    res.status(200).send("Stream audio");

})

app.get("/audio/:url", async (req, res) => {
                
    const url = req.params.url;

    if(!url){
        return res.send("Plz provide url");
    }

    axios
    .get(url, {
      responseType: "stream",
      "Content-Range": "bytes 16561-8065611",
    })
    .then((Response) => {
      const stream = Response.data;

      res.set("content-type", "audio/mp3");
      res.set("accept-ranges", "bytes");
      res.set("content-length", Response.headers["content-length"]);
      console.log(Response);

      stream.on("data", (chunk) => {
        res.write(chunk);
      });

      stream.on("error", (err) => {
        res.sendStatus(404);
      });

      stream.on("end", () => {
        res.end();
      });
    })
    .catch((Err) => {
      console.log(Err.message);
    });
})

app.get("*", (req, res) => {
  res.status(404).send("No page is there!");
})


const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`App is Listening on http://127.0.0.1:${port}`);
})