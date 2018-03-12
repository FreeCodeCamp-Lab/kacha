#!/usr/bin/env node
'use strict';
const fs = require('fs');
const puppeteer = require('puppeteer');
const yargs = require('yargs');
const watermark = require('./libs/watermark');

const argv = yargs
  .option('t', {
    alias: 'text',
    default: 'FCC成都社区',
  })
  .option('c', {
    alias: 'color',
    default: 'red',
  })
  .option('v', {
    alias: 'version',
    default: false,
  }).argv;


const currentPath = process.cwd();
console.log(`生成图片目录: ${currentPath}`);


const URL = argv._[0] || null;

if (!URL) {
  console.log(`Usage: kacha {url}`); process.exit(0);
}

(async () => { //async function
  console.log(`准备......`);
  const browser = await puppeteer.launch({
    headless: true
  }); //运行一个 headless chrome， 注意参数

  const page = await browser.newPage(); //创建一个空白page
  await page.setViewport({
    width: 1920,
    height: 1020,
  });// 设置窗口的分辨率(按需要设置)
  await page.goto(URL, {
    waitUntil: 'load'
  });//打开指定的页面, 注意 waitUntil 参数, 详细看文档

  let pre = await page.$$('pre');// 选择所有 pre 标签
  let len = pre.length;

  fs.mkdirSync(`${currentPath}/imgs`);

  for (let i = 0; i < len; i++) {
    console.log(`生成图片 (${i + 1} / ${len})`);
    await pre[i].screenshot({ path: `${currentPath}/imgs/code_${i + 1}.png` });  // 每个pre元素生成一个截图
    watermark(`${currentPath}/imgs/code_${i + 1}.png`, argv);
  }

  await browser.close();//关闭浏览器

})().then((v) => {
  console.log('Done!'); process.exit(0);
}).catch((v) => {
  console.log(v); process.exit(-1);
});