import { Configuration, OpenAIApi } from "openai";
import { filter, map, mergeMap } from "rxjs/operators";
import { Observable } from "rxjs";
import {
  fetchListOfSubTopicsAction,
  fetchListOfSubTopicsSuccessAction,
  generateImageAction,
} from "./actions";
import { Action } from "redux";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createSublistPrompt = (genre) =>
  `Below is a comma separated list of themes associated with "${genre.trim()}", for use in trivia/pictionary-like games`;

export const fetchListOfSubTopics = (action$: Observable<Action>) =>
  action$.pipe(
    filter(fetchListOfSubTopicsAction.match),
    mergeMap((action) => {
      return openai.createCompletion({
        model: "text-davinci-002",
        prompt: createSublistPrompt(action.payload),
        temperature: 0.7,
        max_tokens: 256,
        presence_penalty: 0.5,
      });
    }),
    map((response) => {
      const responseToArray = response.data.choices[0].text.trim().split(",");
      return fetchListOfSubTopicsSuccessAction(responseToArray);
    })
  );

//temporary
export const generateImageOnPrompt = (action$: Observable<Action>) =>
  action$.pipe(
    filter(fetchListOfSubTopicsSuccessAction.match),
    map((action) => {
      return generateImageAction(action.payload[0]);
    })
  );
