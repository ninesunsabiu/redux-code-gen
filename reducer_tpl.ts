export const reducerFileTpl = `
import { ReducerStateHandler } from '@/model/types';
import { AGAction } from '@/model/AGAction';
import { #prefix#ActionPayload } from './#_prefix#ActionPayload';
import { #prefix#ActionKey } from './#_prefix#ActionKey';

interface AG#prefix#ReducerState {

}

type #prefix#StateHandler<P> = ReducerStateHandler<AG#prefix#ReducerState, P>;

const initialState = {

};

export function reducer(state = initialState, action: AGAction<any>) {
    switch (action.type) {
        case #prefix#ActionKey.#key#:
            return #_key#Handler(state, action.payload!);
        default:
            return state;
    }
}

const #_key#Handler: #prefix#StateHandler<#prefix#ActionPayload['#_key#']> = (state, payload) => {
    const {  } = payload;
    return state;
};
`;