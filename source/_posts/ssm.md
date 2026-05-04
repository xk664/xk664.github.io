---
title: "Spring"
date: 2025-12-31
categories:
  - SSM
tags:
  - Spring
  - MyBatis
  - SSM
---


# Spring
## IOC容器

**概念：** 用来解耦的，由spring自己维护，IOC容器里面存的是Bean（创建的实例，将其放入IOC）

**特点：**
1.默认是单例
2.可以存在多个容器

### Bean的生命周期

**流程：** 实例化--->属性注入(如果依赖还没有注册到IOC就注册依赖)--->init方法--->Destroy方法（关闭IOC容器后）

#### Bean的实例化

##### 构造方法（默认）
**通过反射创建，即无论构造方法是私有还是公有都可以创建**
![](/images/notes/Screenshot 2025-12-17 211940.png)


##### 静态工厂

指定方法的返回值，作为Bean

![](/images/notes/Screenshot 2025-12-17 212001.png)

##### 实例化工厂

**流程:** 先将工厂注册到IOC-->将工厂的方法的返回值注册到IOC成为Bean

- 普通实例化工厂
需要再配置文件指定工厂类是那个，在指定用工厂类的哪一个方法，由于方法名字无法统一，所以spring统一了规范，即实现FactryBean接口
大赛

```shell
<bean  id="" class="工厂" factry-method="方法名"/bean>
```
- FactryBean接口(默认单例)
Spring提供
可以通过isSingleton修改
![](/images/notes/Screenshot 2025-12-17 214409.png)


#### 属性注入（基本/引用数据类型）

#####  **Setter注入**
![](/images/notes/Screenshot 2025-12-19 154228.png)
![](/images/notes/Screenshot 2025-12-19 154220.png)

#####  构造器注入
```shell
<bean ..........>
	<constructor-arg index="0" ref/value="?">
</bean>
```

意思就是将ref(引用数据类型)或者value(基本数据类型)后面的，填充给对应下标的参数

##### Setter和构造器注入的选择

![](/images/notes/Screenshot 2025-12-19 155531.png)

##### Spring的自动注入
本质也是利用setter
按类型：再IOC容器里面找是否存在同类型的Bean,有且只有一个就直接注入，有多个就报错，没有就不注入
按名称：再IOC容器里面找，名字和属性一样的，将其注入

### 纯注解开发

![](/images/notes/Screenshot 2025-12-21 113145.png)


- @Component注解

代替了原来再Xml文件里面，创建Bean的方式，直接通过这个注解创建

- @Configration

代替了原来Xml里面的，基础配置（命名空间等）

- @ComponentScan

用于配置类，代替的XML里面的扫描Bean功能

- @AutoWired

依赖注入（引用数据类型），默认是按类型注入，配合@Qlifired（名称）来按名称注入

- @Value（？）

依赖注入(基本数据类型)，可再配置类加@properitySorce（配置文件），来将配置文件的内容注入

- 第三方Bean管理（引入的jar里面的Bean）
![](/images/notes/Screenshot 2025-12-21 111020.png)



![](/images/notes/Screenshot 2025-12-21 111006.png)


**当由多个配置类的时候，可只再一个类上面加@configration,通过@import，导入其他配置类**

**当管理第三方Bean的方法有形参的时候，spring的自动装配，会到容器里面，按类型给你找**

## Spring整合Mybatis

## SpringAOP
![](/images/notes/Screenshot 2025-12-23 154351.png)

切面:通知和切入点的关系，将这个切入点和哪个通知绑定

### Aop工作流程

**与正常的流程相比，就是会再初始化Bean之前，先读取切入点，用于后面初始化对象
代理对象拥有目标对象的所有方法，并且再方法上进行增强

![](/images/notes/Screenshot 2025-12-23 162231.png)

### 切入点表达式
![](/images/notes/Screenshot 2025-12-23 163457.png)


![](/images/notes/Screenshot 2025-12-23 163509.png)


### 通知类型

- Before(前置通知)
再切入点方法运行前，执行

- After(后置通知)
再目标方法运行后执行，即使目标方法抛异常，也会执行

- Around(环绕通知)
**注：如果切入点有返回值，通知里面，必须要把这个返回值返回**
![](/images/notes/Screenshot 2025-12-23 170231.png)

- Afterreturn(返回后通知)
再目标方法运行后执行，目标方法抛异常，不会执行

- AfterThrowing
目标方法抛异常后，执行

### 通知获取数据

当需要根据目标方法传入的参数或者返回的数据和抛出的异常，来做具体的增强的时候，就需要会去数据

1.JoinPoint:用于Before和After，可获取参数，方法名等
2.proceedingJoinPoint:用于Around，可以以获取返回值，和目标方法的各种信息
3.After注解后面指定返回的名字，同时也要加一个形参来接受这个返回值
4.AfterThrowing同理

## Spring事务

- 基本流程
![](/images/notes/Screenshot 2025-12-23 174225.png)
![](/images/notes/Screenshot 2025-12-23 174233.png)
![](/images/notes/Screenshot 2025-12-23 174245.png)


# SpringMVC

**注意点：SpringMVC直加载Controller层，Spring只加载其他层，并且用不同的容器管理，SpringBoot会将其整合为一个容器**

## 参数接受

1.当传入的参数和形参名字一样时会自动赋值（无论哪种方式）
2.当形参时引用数据类型时，他会自动调用构造方法创建一个形参，再通过setter将参数赋值给形参的属性（如果是接口则会创建他的实现类，如果是Bean则会注入）
3.当形参名字和参数名字不一样时，通过@Requestparam（"参数"）形参,意思就是将这个参数赋值给这个形参
4.当形参是List集合的时候，由规则2我们知道，他是通过set方法将参数赋值给**属性**,但是我们希望参数作为数据给List,所以使用@RequestParam（不加则是将所有参数赋值给形参）
5.当参数是以JSON格式(请求体)传入，通过@RequestBody将其封装为一个对象
6.SpringMVC默认只支持YYYY/MM/DD的字符串转化为Date,如果需要传入其他格式，就用DatetimeFormat(pattern=“”)指定

## 响应

- ResposeBody
如果不加这个这就是JSP技术，必须返回一个文件，加了这个之后直接将方法return的东西返回，如果是一个实体类，还会自动以Json返回

## 异常处理器

当出现异常的时候，需要统一处理。
异常处理器由SpringMVC管理的，所以需要SpringMVC扫描到他
他的返回值可以直接返回给前端
可通过自定义异常来区分异常
![](/images/notes/Screenshot 2025-12-27 161050.png)


## 拦截器

- 拦截器配置
![](/images/notes/Screenshot 2025-12-27 164657.png)
![](/images/notes/Screenshot 2025-12-27 164723.png)
![](/images/notes/Screenshot 2025-12-27 164847.png)

- 执行流程
![](/images/notes/Screenshot 2025-12-27 164909.png)

# SpringBoot

**理解：就是再Spring的基础上在做简化**

## 配置信息

1.可以通过Evirament直接注入配置文件里面的信息（这个对象封装了全部配置信息）
```java
@AutoWired
private Evirament e;

e.getpropertity()
```

2.将部分配置信息封装为对象
![](/images/notes/Screenshot 2025-12-31 143037.png)


# 配置文件的优先级

![](/images/notes/Screenshot 2025-12-31 145651.png)
file是打完jar包后，和jar包再同一个目录的配置，三四级是jar包内的

## 注意

1.原来再Spring中的配置类，被Springboot的启动类代替（@ComponentScan）等功能
2.单元测试中，当我需要注入Bean的时候，Springboot默认去和test同一个包下的启动类加载环境，所以test要与启动类同包同名(也可以再test指定加载哪个启动类)
3.启动类会扫描他虽在包及其子包，所以启动类的位置很重要
