StaticPage 静态页面自动化工具
==========
![banner](http://file.is26.com/wp-image/2014/03/smart-with-static.jpg)

A tool for quickly creating a static page project .Based on Grunt.

StaticPage是一套旨在提高静态页面开发效率、快速生成模板、开发的的工具。

图文教程可参考博文:[《让前端工作更快、更智能:利用StaticPage自动化工作流》](http://luolei.org/2014/03/front-end-dev-with-grunt-staticpage-workflow/)。

####克隆本仓库

在开发目录下执行：

````
git clone http://192.168.11.42:8090/gzwufulin/grunttemplateproject.git
````

####安装Npm依赖包

详细的依赖包清单请参考`package.json`文件，Grunt相关配置请看`Gruntfile.js`

````
npm install
````

安装完毕之后，你将得到如下的文件结构

####文件结构

静态页面不需要太过复杂的文件结构，最终的发布版本代码和相关文件全部在`build`文件夹中。为了后续维护方便，请适当做好相应的注释和文档。

````
newProject/
|
|-----assets //dev模式下css、js、images等集合
|           |-css
|           |-js
|           |-images
|
|-----build //最终生成的纯净文件夹
|       |-assets //
|           |-css
|               |-min.style.css //  最终生成的为压缩版本的css
|           |-js
|               |-min.js //  最终生成的为压缩版本的js
|               |-other.min.js //  其他js
|           |-images
|
|       |-favicon.ico //  静态页的ico
|       |-index.html
|       |-此处根据项目需求，引入不用文件
|
|-----css //  样式表开发目录
|   |-style.css //  Sass编译处理生成的样式表为style.css，也可直接编辑此样式表
|
|-----js //JavaScript相关
|   |-common.js // 常用的脚本库
|   |-base.js   // 项目的基础脚本，最终把所有脚本合并压缩为min.js
|
|----- .node_modules / // npm安装依赖包所在文件夹
|
|-----.gitignore // 默认使用git，配置好gitignore文件
|-----index // index页面
|-----.ftppass.json // 保存FTP帐号和密码的文件，请注意安全，建议添加到gitignore文件中
|-----Gruntfiles.js // grunt配置文件 建议先阅读配置
|-----package.json //g runt依赖包配置文件

````

####初始化

git clone下来后，可以将`StaticPage`文件夹修改成项目的文件名，建议初始化时可执行一次:

````
grunt default
````

####Grunt配置

######CSS编译&&压缩

使用`cssmin`对文件进行压缩，可有效减少文件大小.

````
grunt cssmin
````

######JS文件

使用`concat`根据自己的需求对js进行压缩（一般简单静态页面使用一个`base.js`即可），默认使用`uglify`对js文件进行压缩，在最终的min.v.js文件前面加上时间戳（可以根据需求删除）。

######文件监听

````
grunt watch
````
可监听所有的开发目录下`.css`,'.js'的变化，自动编译压缩。

可以单独使用`grunt watch:base`进行普通监听`js`目录下所有文件和`css/style.css`。

使用`grunt watch:css`监听`.css`文件。

######打包

使用`grunt build`可自动生成不包含开发时的杂乱文件压缩包，文件名为`项目名称-生成时间.zip`的压缩包。

执行`grunt build`实际上为依次执行'clean:pre', 'copy:main','cssmin','copy:archive', 'clean:post','compress'等命令，首先将先前`build`文件夹中的内容清空，然后生成、复制、压缩最新的代码(不包含`node_modules`文件夹、`.gitignore`、`Gruntfile.js`等配置文件)。

注意:打包后自动压缩html，默认清理掉注释，删除空格在Grunt配置中可选（追求极致可以勾选）。


######发布:上传到FTP服务器

支持直接发布上传到ftp服务器,对于没有使用git的项目做到一个线下版本管理、线上便捷发布。
```
grunt publish
```
注意:发布之前请先执行`grunt bundle`打包最终代码。

ftp帐号与密码保存在`.ftppass`文件中，请注意保密。

####说明

此工具适合简单静态页项目，可根据自己项目需求配置.

#### License

Released under [MIT] LICENSE
