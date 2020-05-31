export const sagaHandlerTpl = `
export function* #_key#Saga(action: AGAction<#prefix#ActionPayload['#_key#']>) {
    try {
        const { } = action.payload!;
        yield put({ type: utilsActionKeys.showSpin });
    } catch (error) {
        formatAlertMessage(error);
    } finally {
        yield put({ type: utilsActionKeys.hiddenSpin });
    }
}
`;

export const sagaFileTpl = `
import { call, put, select } from 'redux-saga/effects';
import { AGAction } from '@/model/AGAction';
import { #prefix#ActionPayload } from './#_prefix#ActionPayload';
import { formatAlertMessage } from '@/apis/tools';
import utilsActionKeys from '@/redux/utils/utilsActionKeys';
${sagaHandlerTpl}\
`;