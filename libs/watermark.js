'use strict';

const path = require('path');
const fs = require('fs');
const gd = require('node-gd');
const color = require('./colors');

module.exports = (filepath, options = {}) => {
  filepath = path.resolve(filepath);
  if (!fs.existsSync(filepath)) {
    return;
  }
  let text = options.text || '';
  let textColor = (color[options.color || 'red']) || [255, 0, 0];
  //todo 使用node-gd库将text写到filepath的图片右下角

};