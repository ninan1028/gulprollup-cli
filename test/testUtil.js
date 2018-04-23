/**
 * Created by ckid_hjqb on 2016/12/26.
 */

let app = require('../app');
let superagent = require('supertest');

module.exports = function() {
    return superagent(app.listen());
}