/**
 * デバック用
 * @param {*} str 
 */
function print(str) {
  console.log(str);
}

/**
 * デバック用
 * @param {*} struct
 */
 function printT(struct) {
  console.table(struct);
}

/**
 * 整数か判定
 * @param {*} value 
 * @returns 
 */
function isInteger(value){
  if(value == ""){
    return false
  }
  if(Number(value) <= 0){
    return false
  }
  return true
}

/**
 * ランダム数生成
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function getRandom( min, max ) {
  return Math.floor( Math.random() * (max + 1 - min) ) + min;
}


// 関数をエクスポートします。
export default {
  print,
  printT,
  isInteger,
  getRandom
};