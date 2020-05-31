import { assertEquals } from 'https://deno.land/std@v0.51.0/testing/asserts.ts';
import { getReducerFileContent, insertNewReducerHandler } from './helper.ts';
import { insertContentExpected } from './insert_expected.ts';

const prefix = 'notice';
const prefixCapitalized = 'Notice';
const key = 'fetchUserInfo';
const keyCapitalized = 'FetchUserInfo';

const contentExpected = `
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
        default:
            return state;
    }
}

const ${key}Handler: ${prefixCapitalized}StateHandler<${prefixCapitalized}ActionPayload['${key}']> = (state, payload) => {
    const {  } = payload;
    return { ...state };
};
`;

const anotherKey = 'changeUserName';
const anotherKeyCapitalized = 'ChangeUserName';

Deno.test({
    name: 'get empty reducer file content',
    fn(): void {
        assertEquals(getReducerFileContent(prefix, key), contentExpected);
    }
});

Deno.test({
    name: 'insert exist reducer file test',
    fn(): void {
        assertEquals(insertNewReducerHandler(contentExpected, { prefix, key: anotherKey }), insertContentExpected);
    }
});