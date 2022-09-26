import { filter, map, mergeMap } from "rxjs/operators";
import { request } from "universal-rxjs-ajax";
import { Observable, of } from "rxjs";
import { Action } from "redux";
import { generateImageActionSuccess, generateImageAction } from "./actions";

export const fetchStableDiffusionImage = (
  action$: Observable<Action>
): Observable<Action> =>
  action$.pipe(
    filter(generateImageAction.match),
    // mergeMap((action) => {
    //   return replicate.models
    //     .get("stability-ai/stable-diffusion")
    //     .then((model) => {
    //       return model.predict({
    //         prompt: action.payload,
    //       });
    //     });
    // }),
    mergeMap((action) =>
      request({
        method: "POST",
        url: "/.netlify/functions/stablediffusion",
        body: {
          prompt: action.payload,
        },
      })
    ),
    map((response: any) => {
      debugger;
      return generateImageActionSuccess(response.response);
    })
  );
