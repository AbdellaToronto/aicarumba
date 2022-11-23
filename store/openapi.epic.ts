import { Configuration, OpenAIApi } from "openai";
import { catchError, filter, map, mergeMap } from "rxjs/operators";
import { from, Observable, of } from "rxjs";
import {
  fetchListOfSubTopicsAction,
  fetchListOfSubTopicsFailure,
  fetchListOfSubTopicsSuccessAction,
  generateImageAction,
  generateImageFromPromptsAction,
} from "./actions";
import { Action } from "redux";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const openAPIModels = {
  code: "code-davinci-002",
  text: "text-davinci-002",
};

const createSublistPrompt = (genre) =>
  `
  // An example of an array of 7 subtopics
  
  // animals
  let subtopics = ["Lion", "Tiger", "Bear", "Swan", "Eagle", "Beetle", "Swordfish"];
  
  // dragons
  let subtopics = ["Smaug", "Dragonite", "Toothless", "Tiamat", "Nidhoggr", "Falkor", "Spyro"];
  
  // ${genre.trim()}
  let subtopics = `;

export const fetchListOfSubTopics = (action$: Observable<Action>) =>
  action$.pipe(
    filter(fetchListOfSubTopicsAction.match),
    mergeMap((action) => {
      return from(
        openai.createCompletion({
          model: openAPIModels.code,
          prompt: createSublistPrompt(action.payload.prompt),
          temperature: 0.7,
          max_tokens: 256,
          presence_penalty: 0.5,
          // stop sequence at the end of the first array's semicolon
          stop: ";",
        })
      ).pipe(
        map((response) => {
          try {
            return eval(response.data.choices[0].text);
          } catch (e) {
            throw new Error(`Error parsing response: ${e.message}`);
          }
        }),
        catchError((error) =>
          of(
            fetchListOfSubTopicsFailure({ error, index: action.payload.index })
          )
        ),
        map((subtopics) => {
          return fetchListOfSubTopicsSuccessAction({
            // subtopics deduped
            subtopics: Array.from(new Set(subtopics)),
            categoryNumber: action.payload.index,
          });
        })
      );
    })
  );

//temporary
export const generateImageOnPrompt = (action$: Observable<Action>) =>
  action$.pipe(
    filter(generateImageFromPromptsAction.match),
    map((action) => {
      const arrayOfPrompts = Array.from({
        ...action.payload,
        length: Object.keys(action.payload).length,
      });

      const randomizedPrompts = arrayOfPrompts.map(
        (subArr: string[]) => subArr[Math.floor(Math.random() * subArr.length)]
      );

      return generateImageAction(randomizedPrompts);
    })
  );
