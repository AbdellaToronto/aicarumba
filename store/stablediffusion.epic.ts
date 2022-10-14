import { catchError, filter, map, mergeMap } from "rxjs/operators";
import { request } from "universal-rxjs-ajax";
import { Observable, of } from "rxjs";
import { Action } from "redux";
import { generateImageActionSuccess, generateImageAction } from "./actions";

export const fetchStableDiffusionImage = (
  action$: Observable<Action>
): Observable<Action> =>
  action$.pipe(
    filter(generateImageAction.match),
    mergeMap((action) =>
      request({
        method: "POST",
        url: "/sd",
        body: {
          prompt: action.payload,
        },
      })
    ),
    map(({ response }: any) => {
      if (response) {
        return generateImageActionSuccess(response);
      } else {
        throw new Error("No response from server");
      }
    }),
    catchError((e) => {
      return of({ type: "GenerationError", payload: e });
    })
  );
