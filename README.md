# testing-rollup

I'm trying to get `rollup` to do what I want, outline in the stackoverflow post below.

[Rollup including unneeded dependancies and missing a function in output](http://stackoverflow.com/questions/36417779/rollup-including-unneeded-dependancies-and-missing-a-function-in-output)

---

## Original StackOverflow Post

### Rollup including unneeded dependancies and missing a function in output

I'm using `rollup` for the first time and it's producing some unexpected results. Below I have the three files in my example along with the output from `rollup` and the kind of output I'm looking for.

I have three files `01.js`, `02.js`, `03.js`.

__01.js__


    import { fakePromise } from './02'

    export default fakePromise


__02.js__

    import { map } from 'lodash'
    import { stupidReference } from './03'

    export function fakePromise (str) {
      return stupidReference(str)
    }

    export function fakeMap (arr) {
      return map(arr, item => item + ' is stupid')
    }

__03.js__

    import Promise from 'bluebird'

    export function stupidReference (str) {
      return Promise.resolve(str)
    }

This is what `rollup` is returning. __(actual)__


    import { map } from 'lodash';
    import Promise from 'bluebird';

    function fakePromise (str) {
      return stupidReference(str)
    }

    export default fakePromise;


This is what I'd expect rollup to return. __(expected)__

    import Promise from 'bluebird';

    function stupidReference (str) {
      return Promise.resolve(str)
    }

    function fakePromise (str) {
      return stupidReference(str)
    }

    export default fakePromise;

I was under the impression that rollup would shake out all the dependencies that you didn't need in your project. However you can see the __actual__ output also includes an unneeded dependency `lodash`, and it's also missing another internal function `stupidReference`.

I'm curious as to why this isn't working as I expected. I'm also curious if I'm using the `rollup` tool correctly. If this is not the intended use, I would really love to find a tool that does achieve the functionality I'm looking for. I'd like to provide a function (or a file like `01.js` above) and have only the code necessary to run that function.

__Update 1__

Unsure what's happening with my code, but the editor on the rollup site is capable of pulling in another file and following the tree down. [Here's a link to exactly what I have.][1]




  [1]: http://rollupjs.org/#%7B%22options%22%3A%7B%22format%22%3A%22cjs%22%2C%22moduleName%22%3A%22myBundle%22%2C%22globals%22%3A%7B%7D%7D%2C%22modules%22%3A%5B%7B%22name%22%3A%22main.js%22%2C%22code%22%3A%22%2F%2F%20ES6%20modules%20let%20you%20import%20all%20of%20another%20module's%5Cn%2F%2F%20exports%20as%20a%20namespace...%5Cnimport%20*%20as%20assert%20from%20'.%2Fassert'%3B%5Cn%5Cn%2F%2F%20...but%20we%20can%20statically%20resolve%20this%20to%20the%5Cn%2F%2F%20original%20function%20definition%5Cnassert.equal(%201%20%2B%201%2C%202%20)%3B%22%7D%2C%7B%22name%22%3A%22assert.js%22%2C%22code%22%3A%22import%20%7B%20format%20%7D%20from%20'.%2Fmodule_1'%5Cn%5Cnexport%20function%20equal%20(%20a%2C%20b%2C%20msg%20)%20%7B%5Cn%5Ctif%20(%20!msg%20)%20msg%20%3D%20format(%20'%25s%20does%20not%20equal%20%25s'%2C%20a%2C%20b%20)%3B%5Cn%5Ctif%20(%20a%20!%3D%20b%20)%20throw%20new%20Error(%20msg%20)%3B%5Cn%7D%5Cn%5Cnexport%20function%20ok%20(%20value%2C%20msg%20)%20%7B%5Cn%5Ctif%20(%20!msg%20)%20msg%20%3D%20format(%20'%25s%20is%20not%20truthy'%2C%20value%20)%3B%5Cn%5Ctif%20(%20!value%20)%20throw%20new%20Error(%20msg%20)%3B%5Cn%7D%5Cn%5Cn%22%7D%2C%7B%22name%22%3A%22module_1.js%22%2C%22code%22%3A%22export%20function%20format%20(%20str%2C%20...args%20)%20%7B%5Cn%5Ctreturn%20str.replace(%20%2F%25s%2Fg%2C%20()%20%3D%3E%20args.shift()%20)%3B%5Cn%7D%22%7D%5D%7D

__Update 2__

I realized that I may have configured babel incorrectly, I installed both the modules below as well as added `.babelrc` and `rollup.config.js`.

    npm i rollup-plugin-babel babel-preset-es2015-rollup --save

__rollup.config.js__

    import babel from 'rollup-plugin-babel';

    export default {
      entry: './01.js',
      plugins: [ babel() ],
      format: 'es6'
    };

__.babelrc__

    {
      "presets": [ "es2015-rollup" ]
    }

With this update the same output is still being produced.
