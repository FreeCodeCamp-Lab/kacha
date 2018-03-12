'use strict';

const path = require('path');
const fs = require('fs');
const gd = require('node-gd');
const color = require('./colors');

// 反色
function ColorReverse(OldColorValue) {
  let OldColorValue = "0x" + OldColorValue;
  let str = "000000" + (0xFFFFFF - OldColorValue).toString(16);
  let color = str.substring(str.length - 6, str.length);
  return toColorFramte(color);
}

//处理六位的颜色值  
function toColorFramte(color) {
  let sColorChange = [];
  for (let i = 0; i < 6; i += 2) {
    sColorChange.push(parseInt("0x" + color.slice(i, i + 2)));
  }
  return sColorChange;
}

module.exports = (filepath, options = {}) => {
  filepath = path.resolve(filepath);

  if (!fs.existsSync(filepath)) {
    return;
  }
  let text = options.text || '';
  let textColor = (color[options.color || 'red']) || [255, 0, 0];
  //todo 使用node-gd库将text写到filepath的图片右下角

  // Create blank new image in memory
  let img = gd.createFromPng(filepath);

  // get point color
  let background = img.getTrueColorPixel(img.width - 20, img.height - 20).toString(16);

  // to reverse color
  let reverseColor = ColorReverse(background);

  // set text color
  let txtColor = img.colorAllocate(reverseColor[0], reverseColor[1], reverseColor[2]);

  // Set full path to font file
  let fontPath = __dirname + '/pingfang.ttf';

  // Render string in image
  if (img.getBoundsSafe(img.width - 120, img.height - 10) && img.height > 50) {
    img.stringFT(txtColor, fontPath, 14, 0, img.width - 140, img.height - 14, `@${text}`);
  } else {
    img.stringFT(txtColor, fontPath, 12, 0, img.width - 120, img.height - 10, `@${text}`);
  }

  // Write image buffer to disk
  img.savePng(filepath, 1, function (err) {
    if (err) {
      throw err;
    }
  });

  // Destroy image to clean memory
  img.destroy();


};