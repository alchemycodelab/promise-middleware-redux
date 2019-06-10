import { createStore, applyMiddleware } from 'redux';
import { promiseMiddleware, isPromise, isValid, createAction } from './index';

describe('promise middleware', () => {
  describe('isPromise', () => {
    it('returns false if not passed a promise', () => {
      const result = isPromise(1234);
      expect(result).toBeFalsy();
    });

    it('returns true if passed a promise', () => {
      const promise = Promise.resolve(1234);
      const result = isPromise(promise);
      expect(result).toBeTruthy();
    });

    describe('isValid', () => {
      it('returns false if action is not an object', () => {
        expect(isValid(() => { })).toBeFalsy();
      });

      it('returns false if action has no type', () => {
        expect(isValid({})).toBeFalsy();
      });

      it('returns false if action has no payload', () => {
        expect(isValid({
          type: 'HI'
        })).toBeFalsy();
      });

      it('returns false if action payload is not a promise', () => {
        expect(isValid({
          type: 'HI',
          payload: 1
        })).toBeFalsy();
      });
    });
  });

  describe('middleware', () => {
    let reducer = null;
    let store = null;

    beforeEach(() => {
      reducer = jest.fn();
      store = createStore(
        reducer,
        applyMiddleware(promiseMiddleware)
      );
    });

    it('dispatches all actions on promise resolve', () => {
      const promise = Promise.resolve(123);
      const action = {
        type: 'MY_ACTION',
        payload: promise
      };

      store.dispatch(action);

      return promise.then(() => {
        expect(reducer).toHaveBeenCalledWith(undefined, {
          type: 'PENDING'
        });

        expect(reducer).toHaveBeenCalledWith(undefined, {
          type: 'FULFILLED'
        });

        expect(reducer).toHaveBeenCalledWith(undefined, {
          type: 'MY_ACTION',
          payload: 123
        });
      });
    });

    it('dispatches all actions on promise reject', () => {
      const promise = Promise.reject(123);
      const action = {
        type: 'MY_ACTION',
        payload: promise
      };

      store.dispatch(action);

      return promise
        .catch(() => { })
        .finally(() => {
          expect(reducer).toHaveBeenCalledWith(undefined, {
            type: 'PENDING'
          });

          expect(reducer).toHaveBeenCalledWith(undefined, {
            type: 'REJECTED',
            payload: 123
          });
        });
    });

    it('passes other properties to main action', () => {
      const promise = Promise.resolve(123);
      const action = {
        type: 'MY_ACTION',
        payload: promise,
        custom: 'hi'
      };

      store.dispatch(action);

      return promise.then(() => {
        expect(reducer).toHaveBeenCalledWith(undefined, {
          type: 'MY_ACTION',
          payload: 123,
          custom: 'hi'
        });
      });
    })
  });

  describe('createAction', () => {
    it('creates an action creator', () => {
      const [
        actionCreator,
        ACTION,
        ACTION_PENDING,
        ACTION_FULFILLED,
        ACTION_REJECTED
      ] = createAction('ACTION', () => Promise.resolve());

      expect(actionCreator).toEqual(expect.any(Function));
      expect(ACTION).toEqual('ACTION');
      expect(ACTION_PENDING).toEqual('ACTION_PENDING');
      expect(ACTION_FULFILLED).toEqual('ACTION_FULFILLED');
      expect(ACTION_REJECTED).toEqual('ACTION_REJECTED');

      expect(actionCreator()).toEqual({
        type: ACTION,
        pendingType: ACTION_PENDING,
        fulfilledType: ACTION_FULFILLED,
        rejectedType: ACTION_REJECTED,
        payload: expect.any(Promise)
      });
    });

    it('throws error if promiseFn is not a function', () => {
      expect(() => {
        const [
          actionCreator,
          ACTION,
          ACTION_PENDING,
          ACTION_FULFILLED,
          ACTION_REJECTED
        ] = createAction('ACTION', {});
      }).toThrow('The second argument to createAction must be a function. Received \'object\'')


    });
  });
});
