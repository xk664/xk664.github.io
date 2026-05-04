---
title: "1.HTML-CSS"
date: 2025-09-06
categories:
  - JavaWeb
tags:
  - HTML
  - CSS
  - 前端
---

# 1.HTML-CSS

		创建一后缀名为html的文件
		以记事本方式打开
		编写
		注：如果直接点击打开，就会运行

```
<html>
	<head>
		<title>HTML快速入门</title>	
	</head>
	<body>
		<h1>hello HTML</h1>
		<img src="D:\xk\Java\jigsawgame\image\animal\animal3\all.jpg">
	</body>
</html>

```


**常用标签**

	1.<img src="图片路径"></img>//插入图片
			src:图片地址（可以为相对路径，绝对路径，网络路径）
					网络路径：在网络上找到图片，然后右键，在新标签页中打开，复制链接即可
	2.<a href="链接" target="?">名字</a>//默认在本窗口打开
			?；
				_blank//新窗口打开
				_self//本窗口打开
	3.<h1>~<h6>//一级标题到六级标题
	4.<video src="路径" controls autoplay width="300"></video>
			controls:显示播放控件
			autoplay:自动播放
			width:视频宽度
			height:视频高度
			上面两个建议只设置一个就行，另外一个会等比例缩放
			单位：
				px:像素
				%: 百分比
	5.<br>换行
	6.<audio src="路径" controls ...></audio>//音频
	7.<p></p>//段落标签，这段结束后，自动换行
	8.<b>内容</b>//加粗
	9.<strong>内容</strong>//加粗
	10.&nbsp:空格
	11.<ins>:下划线
	12.<em>：倾斜
	13.<del>:删除线
	14.&lt:<
	15.&gt:>
	16.<div>：容器，自动换行   
	

## CSS引入方式


	1.行内样式：配合JavaScript使用
		<span style="color: gray;">内容</span>//内容为gray色
	2.行内样式（通常写在head标签中)
		<style>
			span{
			color:gray
			}
		</style>
		body里面的<span>内容</span>，内容就为指定颜色
	3.外部样式：写在一个单独的.css文件中（需要通过Link标签在网页中引入)
		news.css文件中：
			span{
				color:gray
			}
			html中：
			<link rel="stylesheet" href="路径">//写在head里面
			body中直接<span>内容</span>
	4.颜色表示法：(所有颜色都是由红绿蓝调和而来)
		rgb(r,g,b)->rgb(1,1,1)//对应每种颜色取多少，0-255
		rgba(r,g,b,a)->和上述相比a为透明度0-1
		十六进制表示->每种颜色两个16*16=255
	5.颜色选择器（写在head，里面不一定只能有颜色）
		优先级：
		元素选择器：
			<style>
			h1{
			color:gray
			}
		</style>
			将<h1>内容设置为指定颜色
		类选择器：(将body中class="cls"的都设置为该颜色)
				<style>
				.cls{
				color:gray
				}
			</style>
			使用：<span class="cls">内容<span>
			
		id选择器（将body中id为?的元素，都设置为该颜色)
			<style>
				#time{
				color:gray
				}
			</style>
			使用：<span id="time">内容</span>
				
		6.行高:line-height: 30px;
		7:首行缩进：text-indent: 2em;
### 盒子模型

**个人理解:内容在一个盒子里面，然后 有一个更大的盒子装着内容这个小盒子**

		padding：内边距（大盒子边缘到小盒子边缘的距离）
			padding(上，右，下，左）：padding(1px,1px,1px,1px)，如果四个方向的边距都相同则只写一个即可,两个参数的话，第一个参数为上下边距，后者为左右边距
			border(上，下,左，右)://边框
			margin：外边距
			margin(0,auto)//水平居中

		应用：
		{
			width:400px;
			height:300px;
			backgroud-color:....
			box-sizing:border-box//相当于把上面的width和height作为整个大盒子的宽高，如果不加，相当于是内容区域的大小
		}




## flex布局
    

那在上述的案例代码中，其实我们用到了一种布局模式，叫 **flex布局**。

- flex是flexible Box的缩写，意为"弹性布局"。采用flex布局的元素，称为Flex容器（container），它的所有子元素自动成为容器成员，称为Flex项目（item）。
    
- 通过给父容器添加flex属性,来控制子元素的位置和排列方式。
    

![](https://heuqqdmbyk.feishu.cn/space/api/box/stream/download/asynccode/?code=YmRkMWVmZGRiYjZlNDA0ZTZhNmJjZWQyNGRlZTgyODhfSVJ1dUZKTk1nNEx3QmMyQXNSc1dJbXZkMEF4dnE3VFJfVG9rZW46QkVBT2JOd05FbzR0Q2h4S1ZzN2NqUG1qblhjXzE3NTcxNjMwMDE6MTc1NzE2NjYwMV9WNA)


  

- flex布局相关的CSS样式：
    

|                 |               |            |                   |
| --------------- | ------------- | ---------- | ----------------- |
| 属性              | 说明            | 取值         | 含义                |
| display         | 模式            | flex       | 使用flex布局          |
| flex-direction  | 设置主轴          | row        | 主轴方向为x轴，水平向右。（默认） |
| column          | 主轴方向为y轴，垂直向下。 |            |                   |
| justify-content | 子元素在主轴上的对齐方式  | flex-start | 从头开始排列            |
| flex-end        | 从尾部开始排列       |            |                   |
| center          | 在主轴居中对齐       |            |                   |
| space-around    | 平分剩余空间        |            |                   |
| space-between   | 先两边贴边，再平分剩余空间 |            |                   |

如果主轴设置为row，其实就是横向布局。 主轴设置为column，其实就是纵向布局。

![](https://heuqqdmbyk.feishu.cn/space/api/box/stream/download/asynccode/?code=OGM0ODcyODViYjE5ZGQ4ZTlkZDA0NTVjMTNlYTM5Y2FfbER4Rm9NbUZJNEF4V3FmRXZhVVVWMVZCS0pFNlRNZkJfVG9rZW46SmxsS2JFekdJb2FldWV4ZzAxTGNGdTV6blNiXzE3NTcxNjMwMDE6MTc1NzE2NjYwMV9WNA)

