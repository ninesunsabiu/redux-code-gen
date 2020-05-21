const prefix = 'notice';
const prefixCapitalized = 'Notice';
const key = 'fetchUserInfo';
const keyCapitalized = 'FetchUserInfo';
const anotherKey = 'changeUserName';
const anotherKeyCapitalized = 'ChangeUserName';

export const insertContentExpected = `
import { ReducerStateHandler } from '@/model/types';
import { AGAction } from '@/model/AGAction';
import { ${prefixCapitalized}ActionPayload } from './${prefix}ActionPayload';
import { ${prefixCapitalized}ActionKey } from './${prefix}ActionKey';

interface AG${prefixCapitalized}ReducerState {

}

type ${prefixCapitalized}StateHandler<P> = ReducerStateHandler<AG${prefixCapitalized}ReducerState, P>;

const initialState = {

};

export function reducer(state = initialState, action: AGAction<any>) {
    switch (action.type) {
        case ${prefixCapitalized}ActionKey.${keyCapitalized}:
            return ${key}Handler(state, action.payload!);
        case ${prefixCapitalized}ActionKey.${anotherKeyCapitalized}:
            return ${anotherKey}Handler(state, action.payload!);
        default:
            return state;
    }
}

const ${key}Handler: ${prefixCapitalized}StateHandler<${prefixCapitalized}ActionPayload['${key}']> = (state, payload) => {
    const {  } = payload;
    return state;
};

const ${anotherKey}Handler: ${prefixCapitalized}StateHandler<${prefixCapitalized}ActionPayload['${anotherKey}']> = (state, payload) => {
    const {  } = payload;
    return state;
};
`;