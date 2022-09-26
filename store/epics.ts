import { combineEpics } from "redux-observable";

import { fetchListOfSubTopics, generateImageOnPrompt } from "./openapi.epic";
import { fetchStableDiffusionImage } from "./stablediffusion.epic";

export const rootEpic = combineEpics(
  fetchListOfSubTopics,
  fetchStableDiffusionImage,
  generateImageOnPrompt
);
