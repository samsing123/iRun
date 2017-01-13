'use strict';
function _getFileExtension(fileName){
    return fileName.split('.')[1];
}
function _getDateFormat(date){
  var month = parseInt(date.getMonth())+1;
  return date.getFullYear()+'-'+month+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
}
function _getTimestampDate(timestamp){
  var date = new Date(timestamp);
  var month = parseInt(date.getMonth())+1;
  return date.getFullYear()+'-'+month+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
}

function _findTumblrTag(tagArr){
  for(var i=0;i<tagArr.length;i++){
    switch(tagArr[i]){
      case 'health':return 'HEALTH';
      case 'family':return 'FAMILY';
      case 'travel':return 'TRAVEL';
      case 'food':return 'FOOD';
      case 'lifestyle':return 'LIFESTYLE';
    }
  }
}
function _findMaxInArray(valueArr){
  var max = 0;
  for(var i=0;i<valueArr.length;i++){
    if(valueArr[i]>max){
      max=valueArr[i];
    }
  }
  return max;
}
function _getEventDate(start_time,end_time){
  var start_day = start_time.split('-')[2];
  var start_month = start_time.split('-')[1];
  var end_day = end_time.split('-')[2];
  var end_month = end_time.split('-')[1];
  var end_year = end_time.split('-')[0];
  return start_day+'/'+start_month+' - '+end_day+'/'+end_month+'/'+end_year;
}
function _getEventDetailDate(start_time,end_time){
  var start_day = start_time.split('-')[2];
  var start_month = start_time.split('-')[1];
  var start_year = start_time.split('-')[0];
  var end_day = end_time.split('-')[2];
  var end_month = end_time.split('-')[1];
  var end_year = end_time.split('-')[0];
  return start_day+'/'+start_month+'/'+start_year+' - '+end_day+'/'+end_month+'/'+end_year;
}
function _changeDateFormat(start_time){
  start_time = start_time.split(' ')[0];
  var day = start_time.split('-')[2];
  var month = start_time.split('-')[1];
  var year = start_time.split('-')[0];
  return day+'/'+month+'/'+year;
}
function _getTag(tagArr){
  var tagLength = tagArr.length;
  var result = '';
  for(var i=0;i<tagArr.length;i++){
    var haveComma = i+1==tagArr.length?'':',';
    result += tagArr[i]+haveComma;
  }
  return result;
}
function _getTextWithEllipsis(text,maxlimit){
  return ((text).length>maxlimit)?(((text).substring(0,maxlimit-3)) + '...') : text;
}
function _sortArrayByNum(array,field){
  var sortArr = array.slice(0);
  sortArr.sort(function(a,b) {
    return parseInt(b[field]) - parseInt(a[field]);
  });
  return sortArr;
}
function _getRunHistoryDateFormat(start_time){
  if(start_time == 'HOW ABOUT TODAY?'){
    return start_time;
  }
  var date = start_time.split(' ')[0];
  var day = date.split('-')[2];
  var month = date.split('-')[1];
  var year = date.split('-')[0];
  var time = start_time.split(' ')[1];
  var hour = time.split(':')[0];
  var hour_format = 'AM';
  if(parseInt(hour)>12){
    hour = parseInt(hour)-12;
    hour_format = 'PM';
  }else if(parseInt(hour)==12){
    hour_format = 'PM';
  }
  var min = time.split(':')[1];
  return day+'/'+month+'/'+year+" | "+hour+':'+min+hour_format;
}
function _getMonth(start_time){
  var date = start_time.split(' ')[0];
  var month = date.split('-')[1];
  return month;
}
function _getYear(start_time){
  var date = start_time.split(' ')[0];
  var year = date.split('-')[0];
  return year;
}
function _removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}


function _monthToEng(month){
  switch(month){
    case '01':return 'JANUARY';break;
    case '02':return 'FEBRUARY';break;
    case '03':return 'MARCH';break;
    case '04':return 'APRIL';break;
    case '05':return 'MAY';break;
    case '06':return 'JUNE';break;
    case '07':return 'JULY';break;
    case '08':return 'AUGUST';break;
    case '09':return 'SEPTEMBER';break;
    case '10':return 'OCTOBER';break;
    case '11':return 'NOVEMBER';break;
    case '12':return 'DECEMBER';break;
  }
}
function _monthToEngShort(month){
  switch(month){
    case 1:return 'JAN';break;
    case 2:return 'FEB';break;
    case 3:return 'MAR';break;
    case 4:return 'APR';break;
    case 5:return 'MAY';break;
    case 6:return 'JUNE';break;
    case 7:return 'JULY';break;
    case 8:return 'AUG';break;
    case 9:return 'SEP';break;
    case 10:return 'OCT';break;
    case 11:return 'NOV';break;
    case 12:return 'DEC';break;
  }
}
function _monthToEngShortStr(month){
  switch(month){
    case "01":return 'JAN';break;
    case "02":return 'FEB';break;
    case "03":return 'MAR';break;
    case "04":return 'APR';break;
    case "05":return 'MAY';break;
    case "06":return 'JUNE';break;
    case "07":return 'JULY';break;
    case "08":return 'AUG';break;
    case "09":return 'SEP';break;
    case "10":return 'OCT';break;
    case "11":return 'NOV';break;
    case "12":return 'DEC';break;
  }
}
function _secondToMinuteDisplay(seconds,type){
  if(seconds==' - '){
    return seconds;
  }
  var minute = 0;
  var second = 0;

  if(seconds>=60){
    minute = seconds/60;
    minute = parseInt(minute);
    second = seconds-minute*60;
    second = second.toFixed(0);
  }else{
    second = seconds.toFixed(0);
  }
  if(second==60){
    minute++;
    second = 0;
  }
  if(minute<10){
    minute = "0"+minute;
  }
  if(second<10){
    second = "0"+second;
  }

  switch(type){
    case "time":return minute+":"+second;
    case "pace":return minute+"'"+second+'"';
  }
}

function _dateLastRunFormat(dateString){
  var eng = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date(dateString).getDay()];
  var month = _monthToEng(dateString.split('-')[1]);
  console.log(eng+', '+month+' '+dateString.split('-')[2]);
  return eng+', '+month+' '+dateString.split('-')[2];
}
function _dateLastRunFormat2(dateString){
  return dateString.split('-')[2]+'/'+dateString.split('-')[1]+'/'+dateString.split('-')[0];
}

function _removeSymbol(title){
  return title.replace("<br/>", "");
}

function _getWeatherImage(number){
  switch(number){
    case '1':return require('../Images/1.png');break;
    case '2':return require('../Images/2.png');break;
    case '3':return require('../Images/3.png');break;
    case '4':return require('../Images/4.png');break;
    case '5':return require('../Images/5.png');break;
    case '6':return require('../Images/6.png');break;
    case '7':return require('../Images/7.png');break;
    case '8':return require('../Images/8.png');break;
    case '9':return require('../Images/9.png');break;
    case '10':return require('../Images/10.png');break;
    case '11':return require('../Images/11.png');break;
    case '12':return require('../Images/12.png');break;
    case '13':return require('../Images/13.png');break;
    case '14':return require('../Images/14.png');break;
    case '15':return require('../Images/15.png');break;
    case '16':return require('../Images/16.png');break;
    case '17':return require('../Images/17.png');break;
    case '18':return require('../Images/18.png');break;
    case '19':return require('../Images/19.png');break;
    case '20':return require('../Images/20.png');break;
    case '21':return require('../Images/21.png');break;
    case '50':return require('../Images/50.png');break;
    case '51':return require('../Images/51.png');break;
    case '52':return require('../Images/52.png');break;
    case '53':return require('../Images/53.png');break;
    case '54':return require('../Images/54.png');break;
    case '60':return require('../Images/60.png');break;
    case '61':return require('../Images/61.png');break;
    case '62':return require('../Images/62.png');break;
    case '64':return require('../Images/64.png');break;
    case '65':return require('../Images/65.png');break;
  }
}



var Util = {
    _getFileExtension:_getFileExtension,
    _getDateFormat:_getDateFormat,
    _findTumblrTag:_findTumblrTag,
    _getEventDate:_getEventDate,
    _getEventDetailDate:_getEventDetailDate,
    _getTag:_getTag,
    _getTextWithEllipsis:_getTextWithEllipsis,
    _changeDateFormat:_changeDateFormat,
    _sortArrayByNum:_sortArrayByNum,
    _getRunHistoryDateFormat:_getRunHistoryDateFormat,
    _getMonth:_getMonth,
    _getYear:_getYear,
    _monthToEng:_monthToEng,
    _monthToEngShort:_monthToEngShort,
    _secondToMinuteDisplay:_secondToMinuteDisplay,
    _removeA:_removeA,
    _dateLastRunFormat:_dateLastRunFormat,
    _dateLastRunFormat2:_dateLastRunFormat2,
    _removeSymbol:_removeSymbol,
    _findMaxInArray:_findMaxInArray,
    _getTimestampDate:_getTimestampDate,
    _getWeatherImage:_getWeatherImage,
    _monthToEngShortStr:_monthToEngShortStr,
};
module.exports = Util;
