var cron = require('node-cron');
let dotenv = require('dotenv');
const axios = require('axios');
dotenv.config()
const fs = require('fs');
const AWS = require('aws-sdk');
const sizeOf = require('image-size')
const path = require('path');
const { html2pdf, base64ToPdf, bufferToPdf } = require('better-html-pdf');

//need to make sure the image path makes sense from the perspective of the final pdf location

const imageReplacement = async () => {

const  htmlString = '<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">\n<head>\n<title></title>\n\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>\n <br/>\n<style type="text/css">\n<!--\n\tp {margin: 0; padding: 0;}	.ft10{font-size:14px;font-family:Times;color:#231f20;}\n\t.ft11{font-size:44px;font-family:Times;color:#231f20;}\n\t.ft12{font-size:20px;font-family:Times;color:#231f20;}\n\t.ft13{font-size:14px;line-height:27px;font-family:Times;color:#231f20;}\n\t.ft14{font-size:14px;line-height:26px;font-family:Times;color:#231f20;}\n\timg {\n    width: 50%;\n    float: right;\n    padding: 87px;\n}\n-->\n</style>\n</head>\n<body bgcolor="#A0A0A0" vlink="blue" link="blue">\n<div id="page1-div" style="position:relative;width:1836px;height:918px;">\n<img width="50%" height="auto" src="https://i.ibb.co/TcdbZDR/chris.png" alt="background image"/>\n<p style="position:absolute;top:197px;left:90px;white-space:nowrap" class="ft10">M</p>\n<p style="position:absolute;top:251px;left:90px;white-space:nowrap" class="ft13">You are relentlessly thoughtful, selfless &amp; determined and you are going to be the best&#160;<br/>mother in the world. I only hope our child gets the majority of&#160;your genes, and maybe&#160;<br/>some of my red hair &amp; dimples sprinkled in&#160;</p>\n<p style="position:absolute;top:359px;left:90px;white-space:nowrap" class="ft13">I can’t wait to raise a family with you, grow old with you, and&#160;constantly fall in love with&#160;<br/>you, day-in and day-out.&#160;</p>\n<p style="position:absolute;top:440px;left:90px;white-space:nowrap" class="ft10">But don’t take my word for it.</p>\n<p style="position:absolute;top:494px;left:90px;white-space:nowrap" class="ft14">What a better way to celebrate the handwritten first draft queen herself than with a&#160;<br/>timeless collection of those who know you best &amp; love you most&#160;from near and far.&#160;</p>\n<p style="position:absolute;top:575px;left:90px;white-space:nowrap" class="ft10">Cheers to the best life with the best wife.</p>\n<p style="position:absolute;top:629px;left:90px;white-space:nowrap" class="ft13">Forever & always<br/>Hub </p>\n<p style="position:absolute;top:100px;left:90px;white-space:nowrap" class="ft11">Hub</p>\n<p style="position:absolute;top:841px;left:819px;white-space:nowrap" class="ft12">2</p>\n</div>\n</body>\n</html>';


// Read the image file and get its aspect ratio
const imgPath = './chris.png';
const img = fs.readFileSync(imgPath);
const imgSize = sizeOf(img)
const aspectRatio = imgSize.width / imgSize.height;

console.log('image height' + imgSize.height)
console.log('image width' + imgSize.width)


var optionsObj = {
  width: '17in',
  height: '8.5in',
  path: './testing5.pdf'
};
console.log('html' + htmlString);

const pdf = await html2pdf(htmlString, optionsObj)

console.log('final pdf' + pdf);

  
}

imageReplacement();