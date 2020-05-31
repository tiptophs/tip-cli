#!/usr/bin/env node

//命令行工具
const program = require("commander")
//git地址下载工具
const download = require("download-git-repo")


//使用Node开发命令行工具所执行javascript脚本，顶部必须引入#!/usr/bin/env node 生命
console.log('tip-cli 脚手架工具')

//创建模板列表
const templates = {
    "cheap-tpl":{
        "url":"https://github.com/tiptophs/cheap-tpl",
        "downloadUrl":"https://github.com:tiptophs/cheap-tpl#master",
        "description":"简单模板配置"
    },
    "standard-tpl":{
        "url":"https://github.com/tiptophs/standard-tpl",
        "downloadUrl":"https://github.com:tiptophs/standard-tpl#master",
        "description":"标准模板配置"
    }
}


// 1.0 获取用户输入的命令参数
//console.log(process.argv), 原声这种方式较为麻烦，这里采用依赖包commander
program
  .version('0.1.0')     //版本


//初始化模板类型和项目名称
program
  .command('init <templateName> <projectName>')   //命令
  .description('初始化项目模板...')   //描述信息
  .action(function(templateName, projectName){
    //下载相应的文件
    const { downloadUrl } = templates[templateName]
    console.log(downloadUrl, 'x')
    download(downloadUrl, projectName, {clone: true}, (err)=>{
        console.log(err? '很遗憾，模板下载失败，请稍后重试。':'恭喜您，模板下载成功。')
    })
  });


//显示可以应用的模板列表
program
  .command('list')
  .description('查看所有可用模板...')
  .action(()=>{
    for(let key in templates){
        console.log(`${key}:${templates[key].description}`)
    }
  })

program.parse(process.argv);
// 2.0 根据接受到的参数执行不同的命令,

