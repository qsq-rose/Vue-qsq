//过滤特殊字符
export function stripscript(s) {
  var pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—| {}【】‘；：”“'。，、？]"
  );
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, "");
  }
  return rs;
}
//验证邮箱
export function validateEmail(value) {
  let reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
  return reg.test(value);
}
//验证密码 密码至少8个字符，至少1个大写字母，1个小写字母和1个数字
export function CheckPassword(value) {
  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return reg.test(value);
}
export function validateCode(value) {
  let reg = /^[a-z0-9]{6}$/;
  //let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[])+$)([^(0-9a-zA-Z)]|[]|[a-zA-Z]|[0-9]){6,}$/;
  return reg.test(value);
}
