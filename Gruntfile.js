module.exports=function(grunt){
    require('time-grunt')(grunt); // Grunt处理任务进度条提示

    grunt.initConfig({
        // 默认文件目录在这里
        paths:{
            assets:'./assets',// 输出的最终文件assets里面
            css:'./css', // 若简单项目，可直接使用原生CSS，同样可以grunt watch:base进行监控
            js:'./js', // js文件相关目录
            img:'./img' // 图片相关
        },
        buildType:'Build',
        pkg: grunt.file.readJSON('package.json'),
        archive_name: grunt.option('name'), // 此处可根据自己的需求修改

        // 清理掉开发时才需要的文件
        clean: {
            pre: ['dist/', 'build/'], // 删除掉先前的开发文件
            post: ['<%= pkg.name %>*.zip'] // 先删除先前生成的压缩包
        },

        // 检查 js
        jshint: {
            files: ['gruntfile.js', '<%= paths.js %>/**/*.js'],
            options: {
                //这里是覆盖JSHint默认配置的选项
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },

        // 合并 js
        concat: {
            options: {
                separator: ';',
                stripBanners: true
            },
            dist: {
                src: [
                    "js/base.js",
                    "js/common.js"
                ],
                dest: "assets/js/min.js"
            }
        },

        // 压缩 js
        uglify:{
            options:{
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' // js文件打上时间戳
            },
            dist: {
                files: {
                    '<%= paths.assets %>/js/min.js': '<%= paths.assets %>/js/min.js'
                }
            }
        },

        // 压缩最终Build文件夹
        compress:{
            main:{
                options:{
                    archive:'<%= pkg.name %>-<%= grunt.template.today("yyyy") %>年<%= grunt.template.today("mm") %>月<%= grunt.template.today("dd") %>日<%= grunt.template.today("h") %>时<%= grunt.template.today("TT") %>.zip'
                },
                expand:true,
                cwd:'build/',
                src:['**/*'],
                dest:''
            }
        },

        copy:{
            main:{
                files:[
                    {expand: true, src: ['assets/css/**'], dest: 'build/'},
                    {expand: true, src: ['assets/images/**'], dest: 'build/'},
                    {expand: true, src: ['assets/js/**'], dest: 'build/'},
                    {expand: true, src: ['*', '!README.md', '!css/**', '!js/**', '!img/**', '!.gitignore', '!.DS_Store','!Gruntfile.js','!package.json','!node_modules/**','!<%= pkg.name %>*.zip'], dest: 'build/'}
                ]
            },

            images:{
                expand: true,
                cwd:'img/',
                src: ['**','!github.png'],
                dest: 'assets/images/',
                flatten:true,
                filter:'isFile'
            },

            archive:{
                files:[
                    {expand: true, src: ['<%= pkg.name %>.zip'], dest: 'dist/'}
                ]
            }
        },

        // 压缩 css
        cssmin:{
            options:{
                keepSpecialComments: 0
            },
            compress:{
                files:{
                    '<%= paths.assets %>/css/min.style.css': [
                        '<%= paths.css %>/style.css'
                    ]
                }
            }
        },

        // 格式化和清理html文件
        htmlmin:{
            dist: {
                options: {
                    removeComments: true
                    //collapseWhitespace: true // 压缩html:根据情况开启与否
                },

                files: {
                    'build/index.html': 'build/index.html' // 清除html中的注释
                }
            }
        },

        // 监听变化 默认grunt watch 监测所有开发文件变化
        watch:{
            options:{
                // 开启 livereload
                livereload:true,
                // 显示日志
                dateFormate:function(time){
                    grunt.log.writeln('编译完成,用时'+time+'ms ' + (new Date()).toString());
                    grunt.log.writeln('Wating for more changes...');
                }
            },
            css:{
                files:'<%= paths.css %>/**/*.css',
                tasks:['cssmin']
            },
            js:{
                files:'<%= paths.js %>/**/*.js',
                tasks:['jshint', 'concat', 'uglify']
            },
            //若不使用Sass，可通过grunt watch:base 只监测style.css和js文件
            base:{
                files:['<%= paths.css %>/**/*.css','<%= paths.js %>/**/*.js','img/**'],
                tasks:['cssmin','jshint', 'concat', 'uglify','copy:images']
            }

        },

        // 发布到FTP服务器 : 请注意密码安全，sftp的帐号密码保存在主目录 .ftppass 文件
        'sftp-deploy':{
            build: {
                auth: {
                    host: '192.168.11.42',
                    port: 32200,
                    authKey: 'private'
                },
                src: 'build',
                dest: '/home/gzwufulin/htdocs/livehall',
                exclusions: ['build/**/.DS_Store', 'build/**/Thumbs.db']
            }
        }
    });

    // 输出进度日志
    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + '文件: '+filepath + ' 变动状态: ' + action);
    });

    grunt.loadNpmTasks('grunt-contrib-clean');    // 加载包含 "clean" 任务的插件
    grunt.loadNpmTasks('grunt-contrib-concat');    // 加载包含 "clean" 任务的插件
    grunt.loadNpmTasks('grunt-contrib-compress'); // 加载包含 "compress" 任务的插件
    grunt.loadNpmTasks('grunt-contrib-copy');     // 加载包含 "copy" 任务的插件
    grunt.loadNpmTasks('grunt-contrib-cssmin');   // 加载包含 "cssmin" 任务的插件
    grunt.loadNpmTasks('grunt-contrib-jshint');   // 加载包含 "jshint" 任务的插件
    grunt.loadNpmTasks('grunt-contrib-watch');    // 加载包含 "watch" 任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');   // 加载包含 "uglify" 任务的插件
    grunt.loadNpmTasks('grunt-contrib-htmlmin');  // 加载包含 "htmlmin" 任务的插件
    grunt.loadNpmTasks('grunt-sftp-deploy');      // 加载包含 "sftp-deploy" 任务的插件

    // 默认被执行的任务列表
    grunt.registerTask('default', ['jshint', 'concat', 'cssmin','uglify','copy:images']);
    // 执行 grunt build --最终输出的文件 < name-生成日期.zip > 文件
    grunt.registerTask('build', ['clean:pre','copy:images', 'copy:main','cssmin','copy:archive', 'clean:post','htmlmin','compress']);
    // 执行 grunt publish 可以直接上传项目文件到指定服务器FTP目录
    grunt.registerTask('publish', ['sftp-deploy']);

};
