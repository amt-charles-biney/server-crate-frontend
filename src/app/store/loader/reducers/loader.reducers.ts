import { createFeature, createReducer, on } from '@ngrx/store';
import { LoadingStatus } from '../../../types';
import { resetLoader, setLoadingSpinner } from '../actions/loader.actions';

const initialState: LoadingStatus = {
  status: false,
  message: '',
  isError: false,
};
export const loadingFeature = createFeature({
  name: 'loader',
  reducer: createReducer(
    initialState,
    on(setLoadingSpinner, (state, { status, message, isError }) => ({
      ...state,
      status,
      message,
      isError,
    })),
    on(resetLoader, (state) => ({
      ...state,
      status: false,
      isError: false,
      message: '',
    }))
  ),
});

export const { name, reducer, selectLoaderState, selectStatus } =
  loadingFeature;
