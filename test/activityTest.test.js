/**
 * Created by ckid_hjqb on 2016/12/26.
 * @description 红包接口测试
 */
let should = require('should');
let request = require('./testUtil');

describe('gift', function () {
    describe('POST /server/gift/updateGiftReceive', function () {
        it('should return 200', function (done) {
            request()
                .post('/server/gift/updateGiftReceive')
                .expect(200, done);
        });

    })

    describe('GET /gift/updateActivityAwardReceive', function () {
        it('should return 200', function (done) {
            request()
                .get('/gift/updateActivityAwardReceive')
                .expect(200, done);
        });
    })

    describe('GET /gift/getActivitySurplusNum', function () {
        it('should return 200', function (done) {
            request()
                .get('/gift/getActivitySurplusNum')
                .expect(200, done);
        });
        //红包未领完，活动未结束，status 应该为1
        it('should return status 1  when the gift has not been snatch off', function (done) {
            request()
                .get('/gift/getActivitySurplusNum')
                .query({
                    activityCode: 'snatchHbOnWeekend'
                })
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    let response = res.body;
                    response['code'].should.equal('0000');
                    response['data']['status'].should.equal(1);
                    done();
                });
        });
    })
})