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
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createSublistPrompt = (genre) =>
  `
  An example of breaking a genre into subgenres into a comma separated list would be something like
  
  genre "Animals":
  Lion, Bear, Moose, Eagle, Turtle, Blue Whale, Giraffe, Dragonfly
  
  Below is a comma separated list of subgenres associated with the genre "${genre.trim()}", for use in trivia/pictionary-like games:`;

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
      const responseToArray = response.data.choices[0].text
        .replace(":", "")
        .trim()
        .split(",");
      return fetchListOfSubTopicsSuccessAction(
        Array.from(new Set(responseToArray))
      );
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
