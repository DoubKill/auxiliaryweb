/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validPassword(rule, value, callback, _this) {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value && (value.length < 3 || value.length > 16)) {
    callback(new Error('请输入3~16位长度的密码'))
  } else {
    callback()
  }
}

export function validPassword1(rule, value, callback, _this) {
  var reg = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}/
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (_this.userForm.old_password === _this.userForm.new_password) {
    callback(new Error('新密码和原密码相同!'))
  } else if (value && !reg.test(value)) {
    callback(new Error('密码必须同时包含大写英文,小写英文,数字,符号,且不少于8位'))
  } else {
    callback()
  }
}

export function validCheckPass(rule, value, callback, _this) {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== _this.userForm.new_password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
