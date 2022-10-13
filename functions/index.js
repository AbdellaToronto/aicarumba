import functions from "@google-cloud/functions-framework";
import Replicate from "replicate-js";

const replicate = new Replicate({
  token: process.env.SD_TOKEN,
});

// below is a google cloud function to send responses to a replicate based stable diffusion model
functions.http("stablediffusion", async (req, res) => {
  const { prompt } = req.body;

  // allow for all cors requests
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
  res.set("Access-Control-Allow-Credentials", "true");

  const result = await replicate.models
    .get("stability-ai/stable-diffusion")
    .then((model) => {
      return model.predict({
        prompt,
      });
    });
  res.status(200).send(result);
});
