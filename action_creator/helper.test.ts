import { getActionPayloadFileContent } from './helper.ts';
import { assertEquals } from 'https://deno.land/std@v0.51.0/testing/asserts.ts';

const prefix = 'notice';
const prefixCapitalized = 'Notice';
const actionPayloadFileTpl = `
import { ActionPayloadRecord } from '@/model/types';
import * as actions from './${prefix}Action';

export type ${prefixCapitalized}ActionPayload = ActionPayloadRecord<typeof actions>;
`;

Deno.test({
    name: 'get action payload file content test',
    fn(): void {
        assertEquals(getActionPayloadFileContent(prefix), actionPayloadFileTpl);
    }
});