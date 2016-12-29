'use strict';
var util = require('util');
var path = require('path');
var generator = require('abc-generator');
var fs = require('fs');

module.exports = Gallery;
function Gallery(args, options, config) {
    generator.UIBase.apply(this, arguments);
    console.log("模块初始化完成！");
    if (fs.existsSync('package.json')) {
        this.packJSON = JSON.parse(this.readFileAsString('package.json'));
    } else {
        this.packJSON = {}
    }
}


util.inherits(Gallery, generator.UIBase);

var prt = Gallery.prototype;


//询问作者
prt.askAuthor = function(){
    var cb = this.async();

    var author = {
        name: 'FE',
        email: '@gmail.com'
    };

    if (this.packJSON && this.packJSON.author) {
        var packJSON = this.packJSON.author;
        this.packJSON.author = abcAuthor.name || 'fe-team';
        this.packJSON.email = abcAuthor.email || '@example.com';
    }
    var prompts = [{
        name: 'author',
        message: 'author of component:',
        default: author.name
    },{
        name: 'email',
        message: 'email of author:',
        default: author.email
    }];

    this.prompt(prompts, function (props) {
        this.author = props.author;
        this.email = props.email;
        this.packJSON.author=props.author;
        cb();
    }.bind(this));
}




// prt.mk = function(){
//     var version = this.version;
//     this.mkdir(version);
//     var fold = ['demo','spec','build','plugin','guide','meta'];
//     for(var i=0;i<fold.length;i++){
//         this.mkdir(path.join(version, fold[i]));
//     }
// }

//创建文件夹
prt.copyFile = function(){
    this.directory('configs', 'configs');    //拷贝目录
    this.directory('server', 'server');    //拷贝目录
    this.directory('src', 'src');    //拷贝目录
    this.copy('gulpfile.js','gulpfile.js');
    this.copy('README.md','README.md');
    this.copy('package.json','package.json');
    this.copy('.gitignore','.gitignore');
    this.copy('.jshintrc','.jshintrc');

    this.mkdir('dist');
    this.mkdir('docs');
    this.mkdir('mock');

    this.mkdir('src/images');
    this.mkdir('src/scripts/helpers');
    this.mkdir('src/scripts/plugins');
    this.mkdir('src/scripts/vendor');
    this.mkdir('src/scripts/widgets');
}

prt.begin = function(){
    console.log("初始化完成");
    console.log("先全局安装node-dev: npm install -g node-dev");
    console.log("1.根目录下运行npm install");
    console.log("2.根目录下运行npm run dev-comps,进行组件开发");
    console.log("3.根目录下运行npm run dev-pages,进行页面开发");
    console.log("4.根目录下运行npm run build,进行工程打包");    
    console.log("5.根目录下运行npm run deploy,进行预发布测试（执行前修改gulpfile地址）");
}

