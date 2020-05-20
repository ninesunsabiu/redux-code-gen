import { insertToEnum } from "./redux_key_helper.ts";
import { assertEquals } from "https://deno.land/std@v0.51.0/testing/asserts.ts";

const testKeyEnum = 'NoticeActionKey';
const insertContent = 'fetchTestKey = "FETCH_TEST_KEY"';
const testKeyFileContent = `
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
const expected = `
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

const emptyEnumContent = `
export enum ${testKeyEnum} {  }
`;

const emptyEnumContentMultiLine = `
export enum ${testKeyEnum} {



            }
`;

const emptyEnumContentInline = `
export enum ${testKeyEnum} {}
`;
const emptyEnumContentExpected = `
export enum ${testKeyEnum} {
    ${insertContent}
}
`;


Deno.test({
    name: 'insert into enum test',
    fn(): void {
        const transformed = insertToEnum(testKeyFileContent, testKeyEnum, insertContent);
        assertEquals(transformed, expected);
    }
});

Deno.test({
    name: 'insert into empty enum test',
    fn(): void {
        const transformed = insertToEnum(emptyEnumContent, testKeyEnum, insertContent);
        const transformed2 = insertToEnum(emptyEnumContentMultiLine, testKeyEnum, insertContent);
        const transformed3 = insertToEnum(emptyEnumContentInline, testKeyEnum, insertContent);
        assertEquals(transformed, emptyEnumContentExpected);
        assertEquals(transformed2, emptyEnumContentExpected);
        assertEquals(transformed3, emptyEnumContentExpected);
    }
});