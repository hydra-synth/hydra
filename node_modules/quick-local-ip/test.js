/**
 * Created by alokguha on 25/09/15.
 */
var network = require('./index');
var assert = require("assert");
describe('MyIp Tests', function() {
    //Undefined Test
    describe('Undefined Test', function () {
        it('variable network should not be undefined', function () {
            assert.notEqual(network,undefined);
        });
        it('variable network.getLocalIP4 should not be undefined', function () {
            assert.notEqual(network.getLocalIP4(),undefined);
        });
        it('variable network.getLocalIP6 should not be undefined', function () {
            assert.notEqual(network.getLocalIP6(),undefined);
        });
    });
});