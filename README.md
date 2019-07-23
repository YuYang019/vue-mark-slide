# vue-mark-slide

![travis-ci](https://travis-ci.org/maoyuyang/vue-mark-slide.svg?branch=master)
![version](https://img.shields.io/npm/v/vue-mark-slide.svg)
![license](https://img.shields.io/npm/l/vue-mark-slide.svg)


基于 `Markdown` 语法的开箱即用的幻灯片书写工具

based on [vue-mark-display](https://github.com/Jinjiang/vue-mark-display/tree/ac2ae0271cca65db6d30c585f53d32f8248547d6)


## preview

![demo](./demo.gif)


## 特性

- 开箱即用
- 基于 `Markdown` , 并且扩展了一些语法
- 支持代码语法高亮
- 支持移动端（touch controls）
- 可配置

## 基本用法

```
npm install -g vue-mark-slide
```

```
echo '# Hello World' > ppt.md
```

```
vslide run ppt.md
```

## markdown文件示例

- 使用 `----` 作为页面的分隔符
- 可以使用 `<!-- -->` 在每页插入自定义样式 ( 目前支持6种属性 `background` ,
`backgroundColor` ,
`backgroundImage` ,
`color` ,
`style` ,
`stageBackground` )

```
// ppt.md

# Hello World   // page 1

----

<!-- color: red -->
<!-- style: font-size: 12px; font-weight: bold -->

some content    // page 2

----

you can insert html directly    // page 3

<div class="text"> hello </div>

<style>
    .text {
        color: red;
    }
</style>
```

## 进阶

### 引入图片

如果想要在 `md` 文件中引入静态资源，例如图片。我们约定静态资源的文件夹名称为 `assets` 。

总体目录结构应该如下

```
pptDir
├── ppt.md
└── assets
    └── test.png
```

然后，在 `ppt.md` 文件中这样使用，注意请使用相对路径

```
![img](./assets/test.png)
```

### 扩展 markdown

在目录中新增 `vslide.config.js`

```
pptDir
├── vslide.config.js
├── ppt.md
└── assets
    └── test.png
```

在 `vslide.config.js` 中添加如下代码

```
// vslide.config.js
module.exports = {
    markdown: (marked) => {
        // do something for marked
    }
}
```

项目使用 `marked` 进行解析，你可以在对应函数中对传入的 `marked` 实例进行操作

### 自定义过渡动画

`vslide` 本质上是一个基于 `vue` 的单页应用，所以其过渡动画也是基于 `vue` 的 `transition` 。

所以你可以在 `markdown` 文件中，插入对应的 `style` 标签，覆盖 `css` 类名来达到自定义动画的效果

```
.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: all 0.3s;
}
.slide-enter {
  opacity: 0;
}
.slide-leave-to {
  opacity: 0;
}
```

### `vslide.config.js` 选项

| 属性 | 用途 | 类型 / 默认值 |
| ----  | ---- | ---- |
| src  | 给定一个远程的markdown链接，可直接加载该文件 | string / '' |
| page  | 初始加载的页面 | number / 1 |
| baseUrl  | 设置 html 标签`<base />`的`href`属性, 为页面上的所有链接规定默认地址或默认目标 | string / '' |
| autoBaseUrl  | 是否默认把 `src` 作为 `baseUrl` | boolean / true |
| autoBlankTarget  | 点击链接时是否默认打开空页面 | boolean / true |
| autoFontSize  | 是否自动设置字体大小 | boolean / true |
| supportPreview  | 是否开启URL链接预览功能（altKey + 点击） | boolean / true |
| urlHashCtrl  | 当页面改变，是否更新 URL hash | boolean / true |
| keyboardCtrl  | 是否开启快捷键控制（Arrows, Enter, Ctrl+G） | boolean / true |
| markdown | 给定一个远程的markdown链接，可加载该文件 | function / null |


## 更多细节和语法

参见 [vue-mark-display](https://github.com/Jinjiang/vue-mark-display/tree/ac2ae0271cca65db6d30c585f53d32f8248547d6)
