import * as doT from 'dot'
import * as jdistsUtil from 'jdists-util'
import * as jsyaml from 'js-yaml'
interface IDoTAttrs extends jdistsUtil.IAttrs {
  /**
   * 数据来源
   */
  data?: string
  /**
   * 是否重新编译，默认为需要
   */
  rework?: string
}
/**
 * doT 模板渲染
 *
 * @param content 文本内容
 * @param attrs 属性
 * @param attrs.data 数据项，支持 JSON 和 YAML
 * @param attrs.rework 是否重新编译
 * @param scope 作用域
 * @param scope.execImport 导入数据
 * @param scope.compile 编译 jdists 文本
 * @return 返回渲染后的结果
 * @example processor():base
  ```js
  let attrs = {
    data: '#name'
  }
  let scope = {
    execImport: function (importion) {
      return `
        name: tom
        age: 13
      `
    },
    compile: function (content) {
      return 'compile:' + content
    },
  }
  console.log(processor('<b>{{=it.name}} - {{=it.age}}</b>', attrs, scope))
  // > compile:<b>tom - 13</b>
  ```
 * @example processor():execImport is object & rework is No
  ```js
  let attrs = {
    data: '#name',
    rework: 'No'
  }
  let scope = {
    execImport: function (importion) {
      return {
        name: 'tom',
        age: 13,
      }
    },
    compile: function (content) {
      return 'compile:' + content
    },
  }
  console.log(processor('<b>{{=it.name}} - {{=it.age}}</b>', attrs, scope))
  // > <b>tom - 13</b>
  ```
 * @example processor():data is undefined
  ```js
  let attrs = {
  }
  let scope = {
    execImport: function (importion) {
      return importion
    },
    compile: function (content) {
      return 'compile:' + content
    },
  }
  console.log(processor('<b>{{=1 + 2}}</b>', attrs, scope))
  // > compile:<b>3</b>
  ```
 * @example processor():content is null
  ```js
  let attrs = {
  }
  let scope = {
    execImport: function (importion) {
      return importion
    },
    compile: function (content) {
      return content
    },
  }
  console.log(processor(null, attrs, scope))
  // > null
  ```
 */
export = (function (content: string, attrs: IDoTAttrs, scope: jdistsUtil.IScope): string {
  if (!content) {
    return content
  }
  let render = doT.compile(content)
  let data = null
  if (attrs.data) {
    data = scope.execImport(attrs.data)
    if (typeof data === 'string') {
      data = jsyaml.safeLoad(data)
    }
  }
  if (jdistsUtil.isNo(attrs.rework)) {
    return render(data)
  } else {
    return scope.compile(render(data))
  }
}) as jdistsUtil.IProcessor