/**
 * Created by ckid_hjqb on 2016/12/26.
 * @desc 用户注册相关接口测试
 */
let should = require("should");
let request = require('./testUtil');

/**
 * @desc 判断用户是否注册接口
 */
describe('regist', function () {

    //判断用户是否注册接口
    describe('POST /regist/checkPhoneNum', function () {
        //测试请求正常
        it('should return 200', function (done) {
            request()
                .post('/regist/checkPhoneNum')
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        //注册用户
        it('should return data with code 0023', function (done) {
            request()
                .post('/regist/checkPhoneNum')
                .set('Accept', 'application/json')
                .send({
                    telephone: '15675100418'
                }).end(function (err, res) {
                if (err) done(err)
                let response = res.body;
                response['code'].should.equal('0000');
                done();
            })
        })

        //未注册用户
        it('should tell that the user has not registed', function (done) {
            request()
                .post('/regist/checkPhoneNum')
                .set('Accept', 'application/json')
                .send({
                    telephone: '19000000000'
                }).end(function (err, res) {
                if (err) done(err)
                let response = res.body;
                response['code'].should.equal('0023');
                done();
            })
        })

        //手机号格式错误
        it('should tell that the telephone has a wrong format', function (done) {
            request()
                .post('/regist/checkPhoneNum')
                .set('Accept', 'application/json')
                .send({
                    telephone: '190000000'
                }).end(function (err, res) {
                if (err) done(err)
                let response = res.body;
                response['code'].should.not.equal('0000');
                response['code'].should.not.equal('0023');
                done();
            })
        })
    });

    //获取手机验证码接口
    describe('POST /regist/getCode', function () {
        //接口正常
        it('should work correct', function (done) {
            request()
                .post('/regist/getCode')
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        //直接判断新老用户行为，因为发送验证码需要先测试新老用户
        it('should tell user has registed', function (done) {
            request()
                .post('/regist/getCode')
                .set('Accept', 'application/json')
                .send({
                    telephone: '15675100418',
                    authCodetype: '1'
                }).end(function (err, res) {
                if (err) done(err);
                var response = res.body;
                //老用户， 返回的应该不是0000
                response['code'].should.equal('0000');
                done();
            });
        })

        //新用户，应该发送成功
        it('should tell user has registed', function (done) {
            request()
                .post('/regist/getCode')
                .set('Accept', 'application/json')
                .send({
                    telephone: '13120383716',
                    authCodeType: '1'
                }).end(function (err, res) {
                if (err) done(err);
                var response = res.body;
                //新用户， 应该返回0000
                response['code'].should.equal('0000');
                done();
            });
        })

        //如果只有一个参数，应该发送失败
        it('should tell user send fail', function (done) {
            request()
                .post('/regist/getCode')
                .set('Accept', 'application/json')
                .send({
                    telephone: '13120383716'
                }).end(function (err, res) {
                if (err) done(err);
                var response = res.body;
                //发送验证码失败1122
                response['code'].should.equal('1122');
                done();
            });
        })
    })

})
