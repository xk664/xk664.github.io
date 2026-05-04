---
title: "1.添加依赖"
date: 2025-09-03
categories:
  - JavaWeb
tags:
  - Maven
  - 构建工具
---

## 1.添加依赖

```
	<dependencies>
		<dependency>
			坐标		
		</dependency>
	</dependencies>
```

什么是坐标？

- Maven中的坐标是**资源****的唯一标识** , 通过该坐标可以唯一定位资源位置
    
- 使用坐标来定义项目或引入项目中需要的依赖
    

  

Maven坐标主要组成：

- groupId：定义当前Maven项目隶属组织名称（通常是域名反写，例如：com.itheima）
    
- artifactId：定义当前Maven项目名称（通常是模块名称，例如 order-service、goods-service）
    
- version：定义当前项目版本号
    
    - SNAPSHOT: 功能不稳定、尚处于开发中的版本，即快照版本
        
    - RELEASE: 功能趋于稳定、当前更新停止，可以用于发行的版本

## 2.导入maven项目


	 方式一：`File` -> `Project Structure` -> `Modules` -> `Import Module` -> `选择maven项目的pom.xml`。
	 方式二：`Maven面板` -> `+（Add Maven Projects）` -> `选择maven项目的pom.xml`。

## 3.  依赖管理

    

依赖：指当前项目运行所需要的jar包。一个项目中可以引入多个依赖：

例如：在当前工程中，我们需要用到logback来记录日志，此时就可以在maven工程的pom.xml文件中，引入logback的依赖。具体步骤如下：

1. 在pom.xml中编写`<dependencies>`标签
    
2. 在`<dependencies>`标签中使用`<dependency>`引入坐标
    
3. 定义坐标的 `groupId`、`artifactId`、`version`
    

```XML
<dependencies>
    <!-- 依赖 : spring-context -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>6.1.4</version>
    </dependency>
</dependencies>
```

4. 点击刷新按钮，引入最新加入的坐标
    

刷新依赖：保证每一次引入新的依赖，或者修改现有的依赖配置，都可以加入最新的坐标


## 4.单元测试（Junit)
### 步骤

	1.添加Junit框架:

```XML
<!--Junit单元测试依赖-->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.9.1</version>
    <scope>test</scope>
</dependency>
```
	<scope></scope>表示依赖的作用范围
	默认在main和test都可以用

	2. 在test/java目录下，创建测试类，并编写对应的测试方法，并在方法上声明@Test注解。

```Java
@Test
public void testGetAge(){
    Integer age = new UserService().getAge("110002200505091218");
    System.out.println(age);
}
```


	3. 运行单元测试 (测试通过：绿色；测试失败：红色)。

### 断言

	JUnit提供了一些辅助方法，用来帮我们确定被测试的方法是否按照预期的效果正常工作，这种方式称为断言。
	在工具类Asserts里面

|                                                       |                           |
| ----------------------------------------------------- | ------------------------- |
| 断言方法                                                  | 描述                        |
| assertEquals(Object exp, Object act, String msg)      | 检查两个值是否相等，不相等就报错。         |
| assertNotEquals(Object unexp, Object act, String msg) | 检查两个值是否不相等，相等就报错。         |
| assertNull(Object act, String msg)                    | 检查对象是否为null，不为null，就报错。   |
| assertNotNull(Object act, String msg)                 | 检查对象是否不为null，为null，就报错。   |
| assertTrue(boolean condition, String msg)             | 检查条件是否为true，不为true，就报错。   |
| assertFalse(boolean condition, String msg)            | 检查条件是否为false，不为false，就报错。 |
| assertSame(Object exp, Object act, String msg)        | 检查两个对象引用是否相等，不相等，就报错。     |
| assertThrows(期盼异常的字节码，函数式接口)                          |                           |
**注意：**

	后面那个String为错误提示信息，
	可以不加，第一个参数为你预期的结果，第二个为实际结果，如果不相等的话，会测试不通过

### 注解

|                    |                                   |
| ------------------ | --------------------------------- |
| 注解                 | 说明                                |
| @Test              | 测试类中的方法用它修饰才能成为测试方法，才能启动执行        |
| @BeforeEach        | 用来修饰一个实例方法，该方法会在每一个测试方法执行之前执行一次。  |
| @AfterEach         | 用来修饰一个实例方法，该方法会在每一个测试方法执行之后执行一次。  |
| @BeforeAll         | 用来修饰一个静态方法，该方法会在所有测试方法之前只执行一次。    |
| @AfterAll          | 用来修饰一个静态方法，该方法会在所有测试方法之后只执行一次。    |
| @ParameterizedTest | 参数化测试的注解 (可以让单个测试运行多次，每次运行时仅参数不同) |
| @ValueSource       | 参数化测试的参数来源，赋予测试方法参数               |
| @DisplayName       | 指定测试类、测试方法显示的名称 （默认为类名、方法名）       |
**格式：**

```java
@DisplayName("测试用户性别")
@ParameterizedTest  
@ValueSource(strings = {"100000200010011011", "100000200010011031", "100000200010011051"})  
public void testGetGender(String idCard) {  
    UserService userService = new UserService();  
    String gender = userService.getGender(idCard);  
    Assertions.assertEquals("男",gender);  
}
```


## 5.依赖范围

	依赖的jar包，默认情况下，可以在任何地方使用，在main目录下，可以使用；在test目录下，也可以使用。

	在maven中，如果希望限制依赖的使用范围，可以通过 `<scope>…</scope>` 设置其作用范围。

|             |     |      |        |
| ----------- | --- | ---- | ------ |
| scope值      | 主程序 | 测试程序 | 打包（运行） |
| compile（默认） | Y   | Y    | Y      |
| test        | -   | Y    | -      |
| provided    | Y   | Y    | -      |
| runtime     | -   | Y    | Y      |
**注意**
	maven项目中，如何将依赖范围改成test，打包为jar包后，原来的依赖不参与打包，那我后面用这个打包过后的项目，那岂不是有些依赖就用不了了
	
