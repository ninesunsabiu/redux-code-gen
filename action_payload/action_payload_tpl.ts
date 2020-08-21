export const actionPayloadFileTpl = `\
import { ActionPayloadRecord } from '@/model/types';
import * as actions from './#_prefix#Action';

export type #prefix#ActionPayload = ActionPayloadRecord<typeof actions>;
`;