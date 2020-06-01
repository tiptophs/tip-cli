#!/usr/bin/env node

//命令行工具
const program = require("commander")
//git地址下载工具
const download = require("download-git-repo")
//命令行交互工具
const inquirer = require("inquirer")
//模板引擎
const handlebars = require("handlebars")
//引入node文件读取
const fs = require("fs")
//引入视觉美化
const ora = require("ora")
//引入chalk增加文本样式
const chalk = require("chalk")
//引入文本前置图标
const logSymbols = require("log-symbols")


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
    //下载文件之前，显示下载loading
    const spinner = ora('正在下载模板...').start()
    //下载相应的文件
    const { downloadUrl } = templates[templateName]
    download(downloadUrl, projectName, {clone: true}, (err)=>{
      //文件下载失败, 报错提示  
      if(err){
        spinner.fail()
        console.log(logSymbols.error, chalk.red('很遗憾，模板下载失败，请稍后重试')) 
        return
      }
      spinner.succeed()
      //把要下载的模板的packjson文件读取出来
      //使用向导的方式读取用户的配置
      //使用模板引擎将用户输入的数据解析到packjson
      //解析完毕后, 将新的文件重新写入到packjson文件中
      inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: '请输入项目名称'
        },
        {
          type: 'input',
          name: 'author',
          message: '请输入创建用户名称'
        },
        {
          type: 'input',
          name: 'description',
          message: '请输入项目描述信息'
        }
      ]).then((answers)=>{
        const path = `${projectName}/package.json`
        const packageContent = fs.readFileSync(path, 'utf-8')
        const packageResult = handlebars.compile(packageContent)(answers)
        fs.writeFileSync(path, packageResult)
        console.log(logSymbols.success, chalk.green('恭喜您，模板初始化成功'))
      })
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

