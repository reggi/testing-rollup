import { map } from 'lodash'
import stupidReference from './03.js'

export function fakePromise (str) {
  return stupidReference(str)
}

export function fakeMap (arr) {
  return map(arr, item => item + ' is stupid')
}
