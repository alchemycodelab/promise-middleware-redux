# Promise Middleware

## Usage
### Import to redux store file
```js
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import { promiseMiddleware } from 'promise-middleware-redux';

export default createStore(
  reducer,
  applyMiddleware(promiseMiddleware),
);
```


### Redux action
```js
export const fetchFacts = () => ({
  type: 'FETCH_FACTS',
  payload: getFacts()
});
```

```js
export const fetchFacts = () => ({
  type: 'FETCH_FACTS',
  pendingType: 'FETCH_FACTS_LOADING',
  fulfilledType: 'FETCH_FACTS_DONE',
  rejectedType: 'FETCH_FACTS_ERROR',
  payload: getFacts()
});
```

### Action Creator

```js
export const [
  fetchFacts, // this is an action creator
  FETCH_FACTS,
  FETCH_FACTS_PENDING,
  FETCH_FACTS_FULFILLED
  FETCH_FACTS_REJECTED
] = createAction('FETCH_FACTS', getFacts);
```
* `fetchFacts` is an action creator
* `FETCH_FACTS` is an action type that is dispatched when the promise
  fulfills. This action will include a `payload` with the fulfilled value.
* `FETCH_FACTS_PENDING` is an action type that is dispatched before
  the promise fulfills.
* `FETCH_FACTS_FULFILLED` is an action type that is dispatched if
  the promise fulfills.
* `FETCH_FACTS_REJECTED` is an action type that is dispatched if
  the promise rejects. This action will also include a `payload`
  with an error.
* `createAction` is a function that takes the name of an action type and a promise and returns all of the above in an array.
