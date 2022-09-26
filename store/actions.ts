import * as types from "./actionTypes";
import { createAction } from "@reduxjs/toolkit";

export const startFetchingUsers = () => ({
  type: types.START_FETCHING_USERS,
});
export const stopFetchingUsers = () => ({
  type: types.STOP_FETCHING_USERS,
});
export const fetchUser = (isServer = false) => ({
  type: types.FETCH_USER,
  payload: { isServer },
});
export const fetchUserSuccess = (response, isServer) => ({
  type: types.FETCH_USER_SUCCESS,
  payload: { response, isServer },
});

export const fetchUserFailure = (error, isServer) => ({
  type: types.FETCH_USER_FAILURE,
  payload: { error, isServer },
});

// OpenAPI actions
export const fetchListOfSubTopicsAction = createAction<string>(
  "openapi/fetchListOfSubTopics"
);
export const fetchListOfSubTopicsSuccessAction = createAction<string[]>(
  "openapi/fetchListOfSubTopicsSuccess"
);

// Stable Diffusion API actions
export const generateImageAction = createAction<string>("sd/generateImage");
export const generateImageActionSuccess = createAction<string>(
  "sd/generatedImageSuccess"
);
