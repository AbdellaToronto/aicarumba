import { Handler } from "@netlify/functions";
import Replicate from "replicate-js";

const replicate = new Replicate({
  token: process.env.NEXT_PUBLIC_SD,
});

const handler: Handler = async (event, context) => {
  const { prompt } = JSON.parse(event.body);

  const result = await replicate.models
    .get("stability-ai/stable-diffusion")
    .then((model) => {
      return model.predict({
        prompt,
      });
    });

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

export { handler };
