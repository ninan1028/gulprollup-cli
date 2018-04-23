var gulp = require('gulp');
var fileinclude = require('gulp-file-include');//替换@@合并html
var inject = require('gulp-inject-string')// 尝试对html中的变量进行替换
var sequence = require('gulp-sequence'); // 任务的 顺序 还是异步执行

var rename = require('gulp-rename');
var changed = require('gulp-changed');
//var gulpif=require('gulp-if');

var concat = require('gulp-concat'); //文件合并
var imagemin = require('gulp-imagemin'); // 图片压缩
var pngquant = require('imagemin-pngquant');

var eslint = require('gulp-eslint'); // js文件检查

var copy = require('gulp-file-copy');

var clean = require('gulp-clean');// 清除文件
var minimist = require('minimist'); // 获取参数
var minifyCss = require('gulp-minify-css'); //- 压缩CSS为一行；
var rev = require('gulp-rev'); //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');//- 路径替换
var uglify = require('gulp-uglify');//js混淆
var sourcemaps = require("gulp-sourcemaps");//map

var less = require('gulp-less');
// 自动加上 css3 前缀
var LessPluginAutoPrefix = require("less-plugin-autoprefix")
//添加  less 当发生异常时提示错误
//var notify = require('gulp-notify');
var plumber = require('gulp-plumber');

var cache = require('gulp-cache');

var template = require('gulp-template');
var inquirer = require('inquirer'); //问答界面
var fs = require('fs');
var rollupPack = require('./buildLib/rolluppack');
// 自动加上 css 前缀
var autoprefix = new LessPluginAutoPrefix({
    browsers: [
        "ie >= 7",
        "ie_mob >= 8",
        "ff >= 26",
        "chrome >= 30",
        "safari >= 6",
        "opera >= 23",
        "ios >= 5",
        "android >= 2.3",
        "bb >= 10",
    ]
})
var source = {}
var config = {
    dev: {
        js: 'http://localhost:8080/statics/scripts',
        css: 'http://localhost:8080/statics/styles',
        img: 'http://localhost:8080/statics/images',
        img2:'http://localhost:8080/statics/images',
        basepath: 'http://localhost:8080',
        htmlbasepath: 'http://localhost:8080/web/html'
    },
    test: {
        js: 'https://dev.huangjinqianbao.com/GBankerWebApp/statics/scripts',
        css: 'https://dev.huangjinqianbao.com/GBankerWebApp/statics/styles',
        img: 'https://dev.huangjinqianbao.com/GBankerWebApp/statics/images',
        img2:'https://dev.huangjinqianbao.com/GBankerWebApp/statics/images',
        basepath: 'https://dev.huangjinqianbao.com/GBankerWebApp',
        htmlbasepath: 'https://dev.huangjinqianbao.com/GBankerWebApp/html',
        shareBasePath: 'https://dev.huangjinqianbao.com/GBankerWebWapOld/'
    },
    online: {
        js: 'https://static02.huangjinqianbao.com/GBankerWebApp/statics/scripts',
        css: 'https://static02.huangjinqianbao.com/GBankerWebApp/statics/styles',
        img: 'https://static02.huangjinqianbao.com/GBankerWebApp/statics/images',
        img2: 'https://m.g-banker.com/GBankerWebApp/statics/images',
        basepath: 'https://m.g-banker.com/GBankerWebApp',
        htmlbasepath: 'https://m.g-banker.com/GBankerWebApp/html',
        shareBasePath: "https://m.g-banker.com/"
    }
}
var knownOptions = {
    string: 'env',
    default: {env: process.env.NODE_ENV || 'dev'}
};

var options = minimist(process.argv.slice(2), knownOptions);

//var browserSync = require("browser-sync").create();//浏览器实时刷新    我写的
//gulp.watch()
var path = {}
var es6SourceMap = {
    sourceMap: true
};
gulp.task("path", function() {
    if (options.env == 'test') {
        path = config.test;
    } else if (options.env == 'mock') {
        path = config.mock;
    } else if (options.env == 'online') {
        path = config.online;
        es6SourceMap.sourceMap = false;
    } else if (options.env == 'test2') {
        path = config.test2;
    } else if (options.env == 'test3') {
        path = config.test3;
    } else if (options.env == "wire") {
        path = config.wire;
    } else {
        path = config.dev;
    }
    console.log("path==" + path.basepath);
})

//用postcss 来解析css

var postcss = require('gulp-postcss');

var pautoprefixer = require('autoprefixer');
var runcksack = require('rucksack-css');
var assets = require('postcss-assets');

var devprocessorArray = [
    runcksack,
    assets({
        cachebuster: true,
        relative: true,
        basePath: ''
    }),
    pautoprefixer({
        browsers: ['last 2 versions', '> 2%']
    })
];
var processorArray = [
    runcksack,
    assets({
        cachebuster: true,
        relative: true,
        basePath: ''
    }),
    pautoprefixer({
        browsers: ['last 2 versions', '> 2%']
    })
];

/**将less解析为css到styles**/
gulp.task("less", function() {
    return gulp.src(['statics/less/*.less'])
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('statics/styles/'))
})

/**开发时增加了cache和plumber**/
gulp.task("devless", function() {
    return gulp.src(['statics/less/*.less'])
        .pipe(sourcemaps.init())
        .pipe(plumber(function(error) {
            console.log(error);
            this.emit('end');
        }))
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('statics/styles/'))
})

gulp.task("lessMainVenue", function () {
    return gulp.src(['statics/less/page/main_venue/*.less'])
        .pipe(cache(less({
            plugins: [autoprefix]
        })))
        .pipe(gulp.dest('statics/styles/main_venue/'))
})


//打包线上代码
gulp.task('css', function() {
    return gulp.src(['statics/styles/**/*.css'])
        .pipe(minifyCss()) //- 压缩处理成一行
        .pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest('web/statics/styles')) //- 输出文件本地
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/css')); //- 将 rev-manifest.json 保存到 rev 目录内
});
gulp.task('js', function() {
    return gulp.src(['statics/scripts/**/*.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('web/statics/scripts'))
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/js')); //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('devcss', function() {
    return gulp.src(['statics/styles/**/*.css']) //- 压缩处理成一行
        .pipe(changed('web/statics/styles'))
        .pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest('web/statics/styles')) //- 输出文件本地
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/css')); //- 将 rev-manifest.json 保存到 rev 目录内
});
gulp.task('devcssmap', function() {
    return gulp.src(['statics/styles/*.map'])
        .pipe(gulp.dest('web/statics/styles'))
});
gulp.task('devjs', function() {
    return gulp.src(['statics/scripts/**/*.js'])
        .pipe(rev())
        .pipe(gulp.dest('web/statics/scripts'))
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev/js')); //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('es6pack', function() {
    return gulp.src(['statics/scriptES/pages/**/*.main.js'])
        .pipe(plumber(function(error) {
            console.log(error);
            this.emit('end');
        }))
        .pipe(rollupPack(es6SourceMap))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('statics/scripts/page/'));
})

gulp.task('devjsmap', function() {
    return gulp.src(['statics/scripts/**/*.map'])
        .pipe(gulp.dest('web/statics/scripts/'))
});

gulp.task('movejs', function() {
    return gulp.src(['statics/scripts/common-jquery.js', 'statics/scripts/common-zepto.js'])
        .pipe(gulp.dest('web/statics/scripts'))
})

gulp.task('watchdevjs', function() {
    return gulp.src(['statics/scripts/**/*.js'])
        .pipe(changed('web/statics/scripts'))
        .pipe(gulp.dest('web/statics/scripts'))
});

gulp.task("devimg", function () {
    return gulp.src(['statics/images/**/*'])
        .pipe(changed('web/statics/images'))
        .pipe(gulp.dest('web/statics/images'))
})

gulp.task('concat:footer1', function () {
    return gulp.src(['statics/scripts/lib/zepto-1.1.6-min.js',
            'statics/scripts/lib/deferred.js',
            'statics/scripts/common/base.js',
            'statics/scripts/common/handlebars.min.js',
            'statics/scripts/common/handlerbarHelper.js',
            'statics/scripts/common/gbankerStatistics.js'
        ])
        .pipe(concat('common-zepto.js'))
        .pipe(gulp.dest('statics/scripts/'))
})
gulp.task('concat:footer2', function () {
    return gulp.src(['statics/scripts/lib/jquery-1.11.2-min.js',
            'statics/scripts/common/base.js',
            'statics/scripts/common/handlebars.min.js',
            'statics/scripts/common/handlerbarHelper.js',
            'statics/scripts/common/gbankerStatistics.js'
        ])
        .pipe(concat('common-jquery.js'))
        .pipe(gulp.dest('statics/scripts/'))
})

gulp.task('rev', function () {
    return gulp.src(['rev/**/*.json', 'web/html/**/*.html'])   //读取 rev-manifest.json 文件以及需要进行js,css名替换的文件
        .pipe(revCollector())                                  //- 执行文件内js,css名的替换
        .pipe(gulp.dest('web/html'));                     //- 替换后的文件输出的目录
});


//在html中引入公共文件 进行解析 在html中得到公共文件
gulp.task("fileinclude", function () {
    return gulp.src(['html/**/*.html', '!html/shared/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'html/shared'
        }))
        .pipe(gulp.dest('web/html'))
})
//替换得到html中的路径
gulp.task('inject', function () {
    return gulp.src(['web/html/**/*.html'])
        .pipe(inject.replace('<%=jsUrl%>', path.js))
        .pipe(inject.replace('<%=cssUrl%>', path.css))
        .pipe(inject.replace('<%=imgUrl%>', path.img))
        .pipe(inject.replace('<%=imgUrl2%>', path.img2)) // 特殊处理 不能用cdn 需要使用本地路径
        .pipe(inject.replace('<%=basePath%>', path.basepath))
        .pipe(inject.replace('<%=htmlbasePath%>', path.htmlbasepath))
        .pipe(inject.replace('<%=shareBasePath%>', path.shareBasePath))
        .pipe(gulp.dest('web/html'))
})

gulp.task('imagemin', function () {
    return gulp.src(['statics/images/**/*'])
        .pipe(gulp.dest('web/statics/images'))
})
gulp.task('jslint', function () {
    return gulp.src(['statics/scripts/**/*.js', '!node_modules/**'])
        .pipe(changed('web/statics/scripts'))
        .pipe(eslint({
            configFile: './.eslintrc'
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
gulp.task('clean:html', function () {
    return gulp.src('web/html')
        .pipe(clean());
})
gulp.task('clean:scriptnewjs', function() {
    return gulp.src(['statics/scripts/page/**/*.main.js','statics/scripts/page/**/*.main.js.map'])
        .pipe(clean());
})
gulp.task('clean', function() {
    return gulp.src('web')
        .pipe(clean())
})
gulp.task('clean:digjs', function() {
    return gulp.src('statics/scripts/page/digGold/**.*')
        .pipe(clean());
})

// 清除缓存
gulp.task('clearCache', function (done) {
    return cache.clearAll(done);
})
gulp.task('watch', function() {
    gulp.watch(['html/**/*.html', 'statics/scriptNew/**/*', 'statics/less/**/*', 'statics/images/**/*', '!statics/styles/**/*'], ['devWatch']);
})

gulp.task('devWatch', function(cb) {
     sequence('path', ['jslint', 'devless'], 'devcss', ['devcssmap', 'es6pack'], ['watchdevjs', "devjsmap", 'devimg'], 'fileinclude', 'inject', 'rev', cb);
});

gulp.task('dev', function(cb) {
    sequence(['clean', 'path'], ['jslint', 'devless'], 'devcss', ['devcssmap', 'es6pack'], ['devjs', "devjsmap", 'devimg'], 'fileinclude', 'inject', 'rev', cb);
});


//gulp.task('default',['serve']);
//上线打包
gulp.task('build', function(cb) {
    sequence(['clean', 'path', "clearCache"], ['jslint', 'less'], 'css', 'es6pack', 'js', 'imagemin', 'fileinclude', 'inject', 'rev', cb);
});

//生成项目文件
gulp.task('init', function(done) {
    var prompts = [{
            name: 'pName',
            message: 'What is the name of your project?',
            default: 'index'
        },
        {
            name: 'title',
            message: 'What is the title of your html?',
            default: 'index'
        },
        {
            name: 'author',
            message: 'the author?',
            default: 'index'
        },
        {
            type: 'confirm',
            name: 'moveon',
            message: 'Continue?'
        }
    ];

    //Ask
    inquirer.prompt(prompts).then(function(answer) {
        if (!answer.moveon) {
            return done();
        }
        console.log(answer);
        var templateobj = {
            title: answer.title,
            csslink: answer.pName + 'Main',
            jslink: answer.pName + '/index',
            cssUrl: '\<%=cssUrl%\>',
            jsUrl: '\<%=jsUrl%\>'
        }
        var pname = answer.pName;
        // 创建html目录 及文件
        gulp.src('template/*.html')
            .pipe(template(templateobj))
            .pipe(gulp.dest('html/pages/' + pname))
            // 创建img目录
        var imgpath = 'statics/images/page/' + pname;
        mkdir(imgpath);
        // 创建js目录文件
        var baseobj = {
            author: answer.author,
            date: new Date().toLocaleString()
        }
           //原来的js目录
        gulp.src('template/*.js')
            .pipe(template(baseobj))
            .pipe(gulp.dest('statics/scripts/page/' + pname));
            //使用 es6开发的 js目录
         gulp.src('template/index.main.js')
            .pipe(template(baseobj))
            .pipe(gulp.dest('statics/scriptNew/pages/' + pname));
        // 创建less目录文件
        gulp.src('template/main.less')
            .pipe(template({
                less: pname + '/index'
            }))
            .pipe(rename(pname + 'Main.less'))
            .pipe(gulp.dest('statics/less'))
            .on('end', function() {
                console.log('end');
            })
        gulp.src('template/index.less')
            .pipe(template(baseobj))
            .pipe(gulp.dest('statics/less/page/' + pname))
        console.log('目录创建完成');

    });
})

function mkdir(path) {
    fs.mkdir(path, function() {
        console.log(path + '目录创建成功')
    })
}