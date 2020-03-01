// 引进控制器
const Controller = require('egg').Controller

const  moment =require('moment')


//node.js 文件操作对象
const fs = require('fs');
//node.js 路径操作对象
const path = require('path');
//故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');

class HomeController extends Controller {
    async index(ctx) {
        await ctx.render('index.html',{});
    }
    async HouseworkUpload() {
        const ctx = this.ctx;
        console.log()
        // console.log()
        //egg-multipart 已经帮我们处理文件二进制对象
        // node.js 和 php 的上传唯一的不同就是 ，php 是转移一个 临时文件
        // node.js 和 其他语言（java c#） 一样操作文件流
        const stream = await ctx.getFileStream();
        //新建一个文件名
        const filename = `${ctx.request.headers.name} ${moment().format('YYYY-MM-DD HH:mm:ss')}.jpg`
        //文件生成绝对路径
        //当然这里这样市不行的，因为你还要判断一下是否存在文件路径
        const target = path.join(this.config.baseDir, 'app/public/uploads', filename);
        //生成一个文件写入 文件流
        const writeStream = fs.createWriteStream(target);
        try {
            // throw '1111'
            //异步把文件流 写入
            await awaitWriteStream(stream.pipe(writeStream));
        } catch (err) {
            this.ctx.status =400
            ctx.body = {
                message: "上传失败"
            };
            //如果出现错误，关闭管道
            await sendToWormhole(stream);
            throw err;
        }
        //文件响应
        ctx.body = {
            url: ctx.host + '/public/uploads/' + filename
        };
    }
    async login(ctx) {
        this.ctx.body = ctx.csrf
    }
}

 

module.exports = HomeController