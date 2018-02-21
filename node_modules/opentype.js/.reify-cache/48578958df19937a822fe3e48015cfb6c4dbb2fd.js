"use strict";var assert;module.watch(require('assert'),{default(v){assert=v}},0);var unhex;module.watch(require('../testutil'),{unhex(v){unhex=v}},1);var loca;module.watch(require('../../src/tables/loca'),{default(v){loca=v}},2);



describe('tables/loca.js', function() {
    it('can parse the short version', function() {
        const data = unhex('DEAD BEEF 0010 0100 80CE');
        assert.deepEqual([32, 512, 2 * 0x80ce], loca.parse(data, 4, 2, true));
    });

    it('can parse the long version', function() {
        const data = unhex('DEADBEEF 00000010 00000100 ABCD5678');
        assert.deepEqual([0x10, 0x100, 0xabcd5678], loca.parse(data, 4, 2, false));
    });
});
