#!/usr/bin/env node

// 交互式命令行
const inquirer = require('inquirer');
// 修改控制台字符串的样式
const chalk = require('chalk');
const fs = require('fs');
const shell = require("shelljs");
const ora = require('ora')
const execa = require('execa'); //  node 端去执行 shell 命令
// 第一个参数就是类型[github/gitlab/Bitbucket]:[账户名]/[仓库名]
const urlObj = {
    'wx-template': `https://github.com/Tongwenfan/wx-template.git`,
    'react-template': `https://github.com/Tongwenfan/create-react-temp.git`,
}
let question = [
    {
        name: 'name',
        type: 'input',
        message: "请输入创建的模板名称",
        validate(val) {
            if (val === '') {
                return chalk.red('Name is required!')
            }
            else {
                return true
            }
        }

    },
    {
        type: 'list',
        message: '请选择开发模版:',
        name: 'temp',
        choices: [
            "wx-template",
            "react-template",

        ],
        filter: function (val) { // 使用filter将回答变为小写
            return val.toLowerCase();
        }

    }
]

inquirer.prompt(question).then(data => {
    let { name, temp } = data;
   const spinner = ora("正在从仓库下载，请耐心等待\n");
    const _url = urlObj[temp];
     spinner.start();
    shell.exec(`git clone ${_url}  ${name}`, ((error, stdout, stderr) => {
        if (error) {
          spinner.fail(`${chalk.red(stderr)}`);
            process.exit();
        }
        // 删除.git 文件
            shell.exec(`cd ${name} && rm -rf .git`,()=>{
                console.log(chalk.green('\n Generation completed!'))
                console.log(`\n cd ${name} \n`)
                console.log(`\n npm i \n`)
                process.exit()
            })
    })
    )



})

