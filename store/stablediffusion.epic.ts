import { filter, map, mergeMap } from "rxjs/operators";
import { request } from "universal-rxjs-ajax";
import { Observable, of } from "rxjs";
import { Action } from "redux";
import { generateImageActionSuccess, generateImageAction } from "./actions";
import Replicate from "replicate-js";

const replicate = new Replicate({
  token: "28ec9f5f7260a9f6a28eab2667db20f24f7e4286",
});

export const fetchStableDiffusionImage = (
  action$: Observable<Action>
): Observable<Action> =>
  action$.pipe(
    filter(generateImageAction.match),
    mergeMap((action) => {
      return replicate.models
        .get("stability-ai/stable-diffusion")
        .then((model) => {
          return model.predict({
            prompt: action.payload,
          });
        });
    }),
    // mergeMap((action) =>
    //   request({
    //     method: "POST",
    //     url: "https://api.replicate.com/v1/predictions",
    //     headers: {
    //       Authorization: "Token 28ec9f5f7260a9f6a28eab2667db20f24f7e4286",
    //       "Access-Control-Allow-Headers": "Authorization",
    //     },
    //     body: {
    //       version: "a9758cbfbd5f",
    //       input: {
    //       },
    //     },
    //   })
    // ),
    map((response: any) => {
      debugger;
      return generateImageActionSuccess(response.response);
    })
  );
