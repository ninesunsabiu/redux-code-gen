import { mapArgsToPoj, replacePrefixAndKey } from './helper.ts';
import { assertEquals } from 'https://deno.land/std@v0.51.0/testing/asserts.ts';

Deno.test({
    name: 'args to plain object test',
    fn(): void {
        const actual = mapArgsToPoj(['--action-prefix=action', '--key=someoneTest', '--payload={ "a": 124, "b": "string", "c": { "a": 124, "b": "fsd" } }']);
        assertEquals(actual, {
            actionPrefix: 'action',
            key: 'someoneTest',
            payload: '{ "a": 124, "b": "string", "c": { "a": 124, "b": "fsd" } }'
        });
    }
});

Deno.test({
    name: 'use saga boolean',
    fn(): void {
        assertEquals(mapArgsToPoj(['--saga=False']), { saga: false });
        assertEquals(mapArgsToPoj(['--saga=trUe']), { saga: true });
        assertEquals(mapArgsToPoj(['--saga']), { saga: undefined });
        assertEquals(mapArgsToPoj(['--saga=21']), { saga: '21' });
    }
});

Deno.test({
    name: 'replace prefix and key',
    fn(): void {
        assertEquals(
            replacePrefixAndKey('#_prefix#', { prefix: 'notice', key: 'fetchNoticeList' }),
            'notice'
        );

        assertEquals(
            replacePrefixAndKey('#prefix#', { prefix: 'notice', key: 'fetchNoticeList' }),
            'Notice'
        );

        assertEquals(
            replacePrefixAndKey('#_key#', { prefix: 'notice', key: 'fetchNoticeList' }),
            'fetchNoticeList'
        );

        assertEquals(
            replacePrefixAndKey('#key#', { prefix: 'notice', key: 'fetchNoticeList' }),
            'FetchNoticeList'
        );
        assertEquals(
            replacePrefixAndKey('#prefix#/#_prefix#\n#key#|#_key#', { prefix: 'notice', key: 'fetchNoticeList' }),
            'Notice/notice\nFetchNoticeList|fetchNoticeList'
        );
    }
})