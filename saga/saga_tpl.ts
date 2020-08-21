export const sagaHandlerTpl = `
export function* #_key#Saga(action: AGAction<#prefix#ActionPayload['#_key#']>) {
    yield {};
}
`;

export const sagaFileTpl = `\
import { AGAction } from '@/model/AGAction';
import { #prefix#ActionPayload } from './#_prefix#ActionPayload';
${sagaHandlerTpl}\
`;