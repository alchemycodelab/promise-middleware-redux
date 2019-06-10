export const isPromise = payload => {
  return Promise.resolve(payload) === payload;
};

export const isValid = action => {
  return typeof action === 'object' &&
    action.hasOwnProperty('type') &&
    isPromise(action.payload)
}

export const PENDING = 'PENDING';
export const FULFILLED = 'FULFILLED';
export const REJECTED = 'REJECTED';

export const createAction = (type, promiseFn) => {
  if (typeof promiseFn !== 'function') {
    throw `The second argument to createAction must be a function. Received '${typeof promiseFn}'`
  }
  const pendingType = `${type}_${PENDING}`;
  const fulfilledType = `${type}_${FULFILLED}`;
  const rejectedType = `${type}_${REJECTED}`;

  return [
    (...args) => ({
      type,
      payload: promiseFn(...args),
      pendingType,
      fulfilledType,
      rejectedType
    }),
    type,
    pendingType,
    fulfilledType,
    rejectedType
  ]
};

export const promiseMiddleware = ({ dispatch }) => next => action => {
  if (!isValid(action)) {
    return next(action);
  }
  const {
    type,
    pendingType = PENDING,
    fulfilledType = FULFILLED,
    rejectedType = REJECTED,
    payload,
    ...rest
  } = action;

  dispatch({ type: pendingType });

  payload.then(payload => {
    dispatch({
      type,
      payload,
      ...rest
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
