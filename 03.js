import Promise from 'bluebird'

export default function stupidReference (str) {
  return Promise.resolve(str)
}
