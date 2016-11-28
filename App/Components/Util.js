'use strict';
function _getFileExtension(fileName){
    return fileName.split('.')[1];
}
function _getDateFormat(date){
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
    case '1':return 'JANUARY';break;
    case '2':return 'FEBRUARY';break;
    case '3':return 'MARCH';break;
    case '4':return 'APRIL';break;
    case '5':return 'MAY';break;
    case '6':return 'JUNE';break;
    case '7':return 'JULY';break;
    case '8':return 'AUGUST';break;
    case '9':return 'SEPTEMBER';break;
    case '10':return 'OCTOBER';break;
    case '11':return 'NOVEMBER';break;
    case '12':return 'DECEMBER';break;
  }
}
function _secondToMinuteDisplay(seconds,type){
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
    _secondToMinuteDisplay:_secondToMinuteDisplay,
    _removeA:_removeA,
    _dateLastRunFormat:_dateLastRunFormat,
    _dateLastRunFormat2:_dateLastRunFormat2,
    _removeSymbol:_removeSymbol,
    _findMaxInArray:_findMaxInArray,
};
module.exports = Util;
