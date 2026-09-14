/**
 * @description before->cond->dispatch
 */

export const beforeFn = (
  initValue,
  event,
  before = config => {
    return config
  },
) => {
  let ConditionValue = initValue
  if (before && typeof before == 'function') {
    ConditionValue = before(ConditionValue)
  }
  if (!ConditionValue) {
    ConditionValue = {
      [`${event.type}`]: true,
    }
  }
  if (ConditionValue) {
    ConditionValue = {
      ...ConditionValue,
      [`${event.type}`]: true,
    }
  }
  return ConditionValue
}

/**
 * @description judge attr exist about condition
 * @param {*} element
 * @param {*} AttrObj
 * @returns
 */
export function valiateByAttr(element, AttrTrueObj, AttrFalseObj) {
  if (!element) {
    return false
  }
  let trueFlag = true
  for (const i in AttrTrueObj) {
    if (element[`${AttrTrueObj[i]}`]) {
      trueFlag = false
    }
  }
  let falseFlag = true
  for (const i in AttrFalseObj) {
    if (element[`${AttrFalseObj[i]}`]) {
      falseFlag = false
    }
  }
  return trueFlag && falseFlag
}
