import { insertToEnum, getInsertActionKeyContent } from './helper.ts';
import { assertEquals } from 'https://deno.land/std@v0.51.0/testing/asserts.ts';

const prefix = 'notice';
const key = 'fetchTestKey';
const keyCapitalized = 'FetchTestKey';
const prefixUpperCased = 'NOTICE';

const testKeyEnum = 'NoticeActionKey';
const insertContent = `${keyCapitalized} = '${prefixUpperCased}_FETCH_TEST_KEY'`;

const testKeyFileContent = `\
export enum ${testKeyEnum} {
    FetchUnreadMessageCount = 'FetchUnreadMessageCount',
    FetchUnreadMessageCountDone = 'FetchUnreadMessageCountDone',
    FetchBotMessages = 'FetchBotMessages',
    FetchBotMessagesDone = 'FetchBotMessagesDone',
    ClearAllMessage = 'ClearAllMessage',
    SetMessageRead = 'SetMessageRead',
    SetMessageReadDone = 'SetMessageReadDone',
    SetAllMessagesRead = 'SetAllMessagesRead',
    SetAllMessagesReadDone = 'SetAllMessagesReadDone',
    SetBotReqStatus = 'SetBotReqStatus'
}
`;
const expected = `\
export enum ${testKeyEnum} {
    FetchUnreadMessageCount = 'FetchUnreadMessageCount',
    FetchUnreadMessageCountDone = 'FetchUnreadMessageCountDone',
    FetchBotMessages = 'FetchBotMessages',
    FetchBotMessagesDone = 'FetchBotMessagesDone',
    ClearAllMessage = 'ClearAllMessage',
    SetMessageRead = 'SetMessageRead',
    SetMessageReadDone = 'SetMessageReadDone',
    SetAllMessagesRead = 'SetAllMessagesRead',
    SetAllMessagesReadDone = 'SetAllMessagesReadDone',
    SetBotReqStatus = 'SetBotReqStatus',
    ${insertContent}
}
`;

Deno.test({
    name: 'get insert key: inline',
    fn(): void {
        assertEquals(getInsertActionKeyContent(prefix, key), insertContent);
    }
})

Deno.test({
    name: 'get insert key: file',
    fn(): void {
        assertEquals(insertToEnum(testKeyFileContent, testKeyEnum, insertContent), expected);
    }
});
