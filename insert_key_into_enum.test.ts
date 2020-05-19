import { insertToEnum } from "./helper.ts";
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


Deno.test({
    name: 'insert into enum test',
    fn(): void {
        const transformed = insertToEnum(testKeyFileContent, testKeyEnum, insertContent);
        assertEquals(transformed, expected)
    }
});