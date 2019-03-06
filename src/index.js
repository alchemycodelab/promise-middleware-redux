export const isPromise = payload => {
  return Promise.resolve(payload) === payload;
};

export const PENDING = 'PENDING';
export const FULFILLED = 'FULFILLED';
export const REJECTED = 'REJECTED';

export const createAction = (type, promise) => ({
  type,
  payload: promise,
  pendingType: `${type}_${PENDING}`,
  fulfilledType: `${type}_${FULFILLED}`,
  rejectedType: `${type}_${REJECTED}`
});

export const promiseMiddleware = ({ dispatch }) => next => action => {
  const {
    type,
    pendingType = PENDING,
    fulfilledType = FULFILLED,
    rejectedType = REJECTED
  } = action;

  if (!isPromise(action.payload)) {
    return next(action);
  }

  dispatch({ type: pendingType });

  action.payload.then(payload => {
    dispatch({
      type,
      payload
    });

    dispatch({ type: fulfilledType });
  })
    .catch(err => {
      dispatch({
        type: rejectedType,
        payload: err
      });
    });
};
