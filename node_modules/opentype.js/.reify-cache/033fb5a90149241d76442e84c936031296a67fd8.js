"use strict";var assert;module.watch(require('assert'),{default(v){assert=v}},0);var Font,Path,Glyph;module.watch(require('../src/opentype'),{Font(v){Font=v},Path(v){Path=v},Glyph(v){Glyph=v}},1);var Layout;module.watch(require('../src/layout'),{default(v){Layout=v}},2);



describe('layout.js', function() {
    let font;
    let layout;
    const notdefGlyph = new Glyph({
        name: '.notdef',
        unicode: 0,
        path: new Path()
    });
    const defaultLayoutTable = {
        version: 1,
        scripts: [],
        features: [],
        lookups: []
    };

    const glyphs = [notdefGlyph].concat('abcdefghijklmnopqrstuvwxyz'.split('').map(function (c) {
        return new Glyph({
            name: c,
            unicode: c.charCodeAt(0),
            path: new Path()
        });
    }));

    beforeEach(function() {
        font = new Font({
            familyName: 'MyFont',
            styleName: 'Medium',
            unitsPerEm: 1000,
            ascender: 800,
            descender: -200,
            glyphs: glyphs
        });
        layout = new Layout(font, 'gsub');
        layout.createDefaultTable = function() { return defaultLayoutTable; };
    });

    describe('getTable', function() {
        it('must not always create an empty default layout table', function() {
            assert.equal(layout.getTable(), undefined);
            assert.equal(layout.getTable(false), undefined);
        });

        it('must create an empty default layout table on demand', function() {
            assert.equal(layout.getTable(true), defaultLayoutTable);
        });
    });

    describe('getScriptTable', function() {
        it('must not create a new script table if it does not exist', function() {
            assert.equal(layout.getScriptTable('DFLT'), undefined);
            assert.equal(layout.getScriptTable('DFLT', false), undefined);
        });

        it('must create an new script table only on demand and if it does not exist', function() {
            const scriptTable = layout.getScriptTable('DFLT', true);
            assert.notEqual(scriptTable, undefined);
            assert.notEqual(scriptTable.defaultLangSys, undefined);
            assert.equal(layout.getScriptTable('DFLT', true), scriptTable, 'must create only one instance for each tag');
        });
    });
});
