import { useMemo } from "react";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "./epics";
import {
  fetchListOfSubTopicsAction,
  fetchListOfSubTopicsFailure,
  fetchListOfSubTopicsSuccessAction,
  generateImageActionSuccess,
  setNumberOfCategories,
  updateCategoryListQuery,
  userGuess,
} from "./actions";

let store;

const INITIAL_STATE = {
  numberOfCategories: 1,
  character: {},
  isFetchedOnServer: false,
  error: null,
  listsOfSubTopics: {},
  response: {},
  categoryData: {},
  userGuesses: {},
};

export enum CategoryState {
  LOADING = "loading",
  LOADED = "loaded",
  ERROR = "error",
  DEFAULT = "default",
}

function reducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case setNumberOfCategories.type:
      return {
        ...state,
        numberOfCategories: payload,
      };
    case fetchListOfSubTopicsSuccessAction.type:
      return {
        ...state,
        listsOfSubTopics: {
          ...state.listsOfSubTopics,
          [payload.categoryNumber]: payload.subtopics,
        },
        categoryData: {
          ...state.categoryData,
          [payload.categoryNumber]: {
            ...state.categoryData[payload.categoryNumber],
            state: CategoryState.LOADED,
          },
        },
      };
    case generateImageActionSuccess.type:
      return {
        ...state,
        response: payload,
      };
    case updateCategoryListQuery.type:
      return {
        ...state,
        categoryData: {
          ...state.categoryData,
          [payload.categoryNumber]: {
            query: payload.subtopic,
            state: CategoryState.DEFAULT,
          },
        },
      };
    case fetchListOfSubTopicsAction.type:
      return {
        ...state,
        categoryData: {
          ...state.categoryData,
          [payload.index]: {
            ...state.categoryData[payload.index],
            state: CategoryState.LOADING,
          },
        },
      };
    case fetchListOfSubTopicsFailure.type:
      return {
        ...state,
        categoryData: {
          ...state.categoryData,
          [payload.index]: {
            ...state.categoryData[payload.categoryNumber],
            state: CategoryState.ERROR,
          },
        },
      };
    case userGuess.type:
      return {
        ...state,
        userGuesses: {
          ...state.userGuesses,
          [payload.categoryNumber]: payload.subtopic,
        },
      };
    default:
      return state;
  }
}

const initStore = (initialState) => {
  const epicMiddleware = createEpicMiddleware();
  const logger = createLogger({ collapsed: true }); // log every action to see what's happening behind the scenes.
  const reduxMiddleware = applyMiddleware(epicMiddleware, logger);

  const store = createStore(reducer, initialState, reduxMiddleware);
  epicMiddleware.run(rootEpic);

  return store;
};

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
