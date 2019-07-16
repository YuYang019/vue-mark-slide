# vue-mark-slide

![travis-ci](https://travis-ci.org/maoyuyang/vue-slide.svg?branch=master)

基于 `Markdown` 语法的开箱即用的幻灯片书写工具

based on [vue-mark-display](https://github.com/Jinjiang/vue-mark-display/tree/ac2ae0271cca65db6d30c585f53d32f8248547d6)


## 特性

- 容易上手，开箱即用
- 基于 `Markdown` , 并且扩展了一些语法
- 支持代码语法高亮
- 可配置

## 基本用法

基于 `vue-mark-display` 扩展了一些语法

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

```
npm install -g vue-mark-slide
vslide run ppt.md
```

## 进阶

### 引入图片

如果想要在 `md` 文件中引入静态资源，例如图片。目录结构应该如下

```
pptDir
├── ppt.md
└── static
    └── test.png
```

然后，在 `ppt.md` 文件中这样使用，注意请使用相对路径

```
![img](./static/test.png)
```

### 扩展 markdown

在目录中新增 `vslide.config.js`

```
pptDir
├── vslide.config.js
├── ppt.md
└── static
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

## 更多细节和语法

参见 [vue-mark-display](https://github.com/Jinjiang/vue-mark-display/tree/ac2ae0271cca65db6d30c585f53d32f8248547d6)
