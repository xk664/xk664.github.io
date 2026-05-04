---
title: "MyBatisPlus"
date: 2026-02-22
categories:
  - SpringCloud
tags:
  - SpringCloud
  - 微服务
  - MyBatisPlus
---


# MyBatisPlus

**Mapper继承BaseMapper,Service继承IService接口，这样，以后Mapper层和Service就不用再写方法了**

## 快速入门

### 基本使用步骤

![](/images/notes/Screenshot 2026-02-07 162053.png)

### 常见注解

**注意：** 当成员属性是boolean类型的时候，且以is开头，mp会去掉is作为数据库中的字段名

![](/images/notes/Screenshot 2026-02-07 163244.png)

## 核心功能 

### 条件构造器

![](/images/notes/Screenshot 2026-02-07 165802.png)

**查询例子：** 查询姓名里面有O,且工资大于等于1000的用户

ge:greater equals （大于等于）
gt: greater than(大于)
```java
@Test  
void test(){  
    QueryWrapper<User> wrapper = new QueryWrapper<User>()  
            .select("id", "username", "info", "balance")  
            .like("username", "o")  
            .ge("balance", 1000);  
    List<User> users = userMapper.selectList(wrapper);  
    users.forEach(System.out::println);  
}
```

**个人理解：** QueryWrapper就是Where后面的条件

**修改例子：** 
第一个参数就是要更新的数据，后面的wrapper是where条件
```java
@Test  
void test(){  
    User user = new User();  
    user.setPassword("1234");  
    QueryWrapper<User> wrapper = new QueryWrapper<User>()  
            .eq("username","Lucy");  
    userMapper.update(user,wrapper);  
}
```

### 自定义SQL

**理解：** 如果我们按上述要求编写SQL的话，需要在业务层编写Wrapper,但实际上应该在Mapper层编写，因此就出现了，将Wrapper在业务层写好，然后传给Mapper，这样就实现了分工

![](/images/notes/Screenshot 2026-02-08 151129.png)

### IService接口的基本使用
**IService接口里面声明了增删改查的各种方法，IServiceImpl中实现了IService接口中的大部分方法**

![](/images/notes/Screenshot 2026-02-08 154954.png)

# Docker

![](/images/notes/Screenshot 2026-02-08 203314.png)


# 微服务

**理解：** SpringCloude就是各种微服务工具的集合，将各种微服务工具整合起来


## Nacos(注册中心)
### 注册中心原理
**个人理解：** 每个微服务的信息（端口和业务等），会注册到注册中心，当微服务之间需要相互调用的时候，直接从注册中心找到被调用者的信息，然后记录下来，当微服务中出现宕机时，注册中心会通过心跳检测，检测到，并将这个结果推送给调用者
![](/images/notes/Screenshot 2026-02-10 204449.png)


### 注册步骤

![](/images/notes/Screenshot 2026-02-10 212048.png)
### 服务发现

![](/images/notes/Screenshot 2026-02-10 223610.png)

## OpenFeign

**解决了微服务之间的相互调用**

#### 快速入门

![](/images/notes/Screenshot 2026-02-11 132210.png)
![](/images/notes/Screenshot 2026-02-11 132522.png)
**注意：** 当再Client这里只加了服务名的时候，他会nacos注册中心查找实例，然后负载均衡给对应的实例发送http请求（依赖nacos）,同时如果直接指定对应的ip和端口，就不用依靠nacos

### 连接池

**Openfeign默认不支持连接池**

**开启连接池：**
![](/images/notes/Screenshot 2026-02-11 140039.png)

### 过滤器


## 网关

**也是一个微服务，也要注册到注册中心**

![](/images/notes/Screenshot 2026-02-11 202224.png)

### 路由规则
![](/images/notes/Screenshot 2026-02-11 202724.png)

### 路由过滤器

指的是当请求到达网关的时候，给这个请求加上请求头，然后再转发给对应的微服务实例

![](/images/notes/Screenshot 2026-02-11 205546.png)

#### GlobalFilter(全局过滤器)
对所有请求生效
![](/images/notes/Screenshot 2026-02-11 213635.png)

#### GatewayFilter

## 配置管理

**优势：** 
![](/images/notes/Screenshot 2026-02-14 120236.png)
**微服务的配置文件里面，就只需要保留不一样的部分**

**配置加载流程：** 

**前提是微服务开启了这个配置**

- 引入依赖
```XML
  <!--nacos配置管理-->
  <dependency>
      <groupId>com.alibaba.cloud</groupId>
      <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
  </dependency>
  <!--读取bootstrap文件-->
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-bootstrap</artifactId>
  </dependency>
```
- 再resource目录新建一个boostrap,yaml文件
- 填写boostrap.yaml文件
```YAML
spring:
  application:
    name: cart-service # 服务名称
  profiles:
    active: dev
  cloud:
    nacos:
      server-addr: 192.168.150.101 # nacos地址
      config:
        file-extension: yaml # 文件后缀名
        shared-configs: # 共享配置
          - dataId: shared-jdbc.yaml # 共享mybatis配置
          - dataId: shared-log.yaml # 共享日志配置
          - dataId: shared-swagger.yaml # 共享日志配置
```

会先加载Nacos中的配置再加载微服务里面的，但是我们把nacos的地址配在了微服务配置里面，他怎么去加载nacos的配置呢，因此bootstrap.yaml就解决了这个问题

![](/images/notes/Screenshot 2026-02-14 122405.png)

### 配置热更新

**当修改配置后，不用重启微服务**


## 服务保护

### 雪崩问题
当微服务A需要去调用微服务B的时候，由于微服务B出现异常导致微服务A一直无法获取到结果造成线程一直被占用，后面的线程就会等待，往上推就会造成大量微服务甚至整个系统瘫痪

- 解决方法
 对每一个微服务做一个线程数量的上限，当微服务的占用线程数量达到上限后，后面来的线程就直接被拒绝，但是如果再线程数量以内，第一个线程就出现异常，造成一直等待，而后面的线程无法察觉，依旧还是发送请求到这个异常的服务，因此我希望当这个微服务的异常线程数，达到阈值后，就**熔断**后面的线程
### Sentinel

监控SpringMvc的http接口

**先启动Sentinel控制台**
- 使用方法
引入依赖
```XML
<!--sentinel-->
<dependency>
    <groupId>com.alibaba.cloud</groupId> 
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

修改配置

```YAML
spring:
  cloud: 
    sentinel:
      transport:
        dashboard: localhost:8090
```

##### fallback
被拒绝的请求都会走fallback包括熔断的
![](/images/notes/Screenshot 2026-02-20 165054.png)
![](/images/notes/Screenshot 2026-02-20 165223.png)

##### 熔断
![](/images/notes/Screenshot 2026-02-20 173147.png)

### 分布式事务

![](/images/notes/Screenshot 2026-02-20 205039.png)

分支事务执行完以后就会报告给TC,但是TC不知道哪个分支事务执行完就代表整个事务执行完，因此就需要TM,当所有任务执行完以后，TM就报告给TC

- XA模式（分支事务再所有事务执行完才提交）
**优点：** 强一致性
**缺点：** 当后面的事务执行时间常，前面的事务等待时间也会变长
![](/images/notes/Screenshot 2026-02-21 105055.png)

- AT模式
**与XA不同的是，分支事务执行完之后会执行一个快照（undo log）,然后直接提交事务，当需要回滚的时候再根据快照回滚**

![](/images/notes/Screenshot 2026-02-21 131010.png)

# RabbitMQ

## 基础

### 整体结构
![](/images/notes/Screenshot 2025-12-04 220349.png)
**理解：**
	1.消息先发送到交换机，由交换机将消息发送给与他绑定的队列（所以必须先绑定）
	2.每个虚拟主机有自己的交换机和队列，实现数据隔离

### work queue

**个人理解：**
	1.一个队列的消息属于同一个业务，同一个队列的不同消费者实现的同样的业务
	2.增加订阅同一个队列的消费者，可以提高这个队列的消息处理速度，prefetch保证了消费者只有处理完当前消息，再接受下一个消息

- **为什么要有交换机？**
因为同一个队列对应了一个微服务（业务），而一条消息往往需要设计多个业务，比如一个订单信息，需要创建订单、删除库存等业务，此时就需要发送到不同的队列（不同业务），所以直接发给交换机，交换机可以将其路由到队列
### Fanout(广播)

**概念：和交换机绑定的所有队列都能收到**

### Direct交换机

和这个交换机绑定的queue，不一定全都能收到，因为queue绑定交换机的时候，要指定routingkey,相当于一个暗号（一个单词），只有暗号和routingkey相同的queue可以收到，不同的queue也可以有相同的routingkey

### Topic交换机

与Direct不同的是，再queue绑定交换机的时候指定的routingkey之一使用通配符，并且可以使用多个单词，发送消息的时候，满足条件的routingkey的队列就可以收到

**注：通配符是用于绑定的时候，不是发送消息的时候**

![](/images/notes/Screenshot 2025-12-06 113901.png)

### 消息转换器

![](/images/notes/Screenshot 2025-12-07 130841.png)


![](/images/notes/Screenshot 2025-12-07 130922.png)

上述能实现的原因是：我自己配置的Bean会优先注册到容器里面，而当spring再注册他自己的Bean的时候，会先判断容器里面是否，已经存在这个Bean,然后再来判断是否注册到容器

## 高级

### 生产者可靠性问题

![](/images/notes/Screenshot 2025-12-07 133427.png)

### 生产者确认

![](/images/notes/Screenshot 2025-12-07 134008.png)

### 持久化

#### 数据持久化
- 非持久化消息
只存在内存中，重启后会丢失，当内存存满以后，出现pageout(将现在内存里面没有处理的消息，写入磁盘，阻塞)，然后再清空内存

- 持久化消息
开始先存入内存，后面异步写入磁盘（内存中的消息仍然不变），当内存满了之后，直接清空内存， 不用再pageout了

#### LazyQueue

![](/images/notes/Screenshot 2025-12-07 153319.png)

### 消费者确认模式

![](/images/notes/Screenshot 2025-12-07 154533.png)

### 幂等性

**概念：执行一次操作和执行多次操作的结果是一样的**

MQ中同一个消息会被多次消费，导致性能损耗

解决方法：

1.
 给每一条消息设置一个id，当消息到达消费者的时候，消费者，先去数据库判断，是否存在这个id(之前是否已经处理过)，如果存在，则直接return,反之就处理，并将其存入数据库

2.

再处理消息的时候，先判断处理的业务是否，已经被处理成了我向处理的样子(乐观锁)，如果是直接return，反之就处理

### RabbitMQ的死信交换机（延迟队列）

![](/images/notes/Screenshot 2025-12-08 103411.png)
延迟队列=死信交换机+TTL

成为死信的条件：
![](/images/notes/Screenshot 2025-12-08 103719.png)

成为死信后，然后进入死信交换机，然后再发送到队列，交给其他消费者处理


### Rabbit的高可用机制

- 普通集群
![](/images/notes/Screenshot 2025-12-08 105048.png)
如果节点一创建了一个队列，其他节点会由节点一的队列的引用，当访问其他节点的时候，实际会通过这个引用访问到储存消息的节点，但是，如果这个节点宕机了，其他节点不知道，就会造成数据丢失

- 镜像集群

![](/images/notes/Screenshot 2025-12-08 105115.png)

每一个节点的每一个队列可能是父队列，也有可能是子队列，通过同步父队列消息到子队列，来 保证一致性吗，但是如果同步过程中，发生宕机导致数据不一致

- 仲裁队列

![](/images/notes/Screenshot 2025-12-08 105131.png)

# Elasticsearch

## 倒排索引


![](/images/notes/Screenshot 2026-02-21 203334.png)

## 基本概念

![](/images/notes/Screenshot 2026-02-21 205539.png)

## Mapping属性

![](/images/notes/Screenshot 2026-02-21 210505.png)

## 索引库操作

**注意：** 创建索引库和Mapping后，只能添加新的字段，不可以修改原来的
### 创建索引库

![](/images/notes/Screenshot 2026-02-21 210705.png)
### 查询索引库

```json
GET /heima
```

### 删除索引库
```JSON
DELETE /heima
```

### 新增文档

![](/images/notes/Screenshot 2026-02-21 211830.png)

### 查询文档

```JavaScript
GET /{索引库名}/_doc/id值
```

### 删除文档

```JavaScript
DELETE /{索引库名}/_doc/id值
```

### 修改文档

#### 全量修改
```JSON
PUT /heima/_doc/1
{
    "info": "黑马程序员高级Java讲师",
    "email": "zy@itcast.cn",
    "name": {
        "firstName": "云",
        "lastName": "赵"
    }
}
```

#### 局部修改
```JSON
POST /{索引库名}/_update/文档id
{
    "doc": {
         "字段名": "新的值",
    }
}
```

### 批量新增

```Java
POST /_bulk
{"index": {"_index":"heima", "_id": "3"}}
{"info": "黑马程序员C++讲师", "email": "ww@itcast.cn", "name":{"firstName": "五", "lastName":"王"}}
{"index": {"_index":"heima", "_id": "4"}}
{"info": "黑马程序员前端讲师", "email": "zhangsan@itcast.cn", "name":{"firstName": "三", "lastName":"张"}}
```

### 批量删除
```Java
POST /_bulk
{"delete":{"_index":"heima", "_id": "3"}}
{"delete":{"_index":"heima", "_id": "4"}}
```

## 客户端
### 快速入门

![](/images/notes/Screenshot 2026-02-21 222215.png)

## DSL查询

### 快速入门

```JSON
GET /{索引库名}/_search
{
  "query": {
    "查询类型": {
      // .. 查询条件
    }
  }
}
```
**查询所有：** （最多一次只能查一万条）
```JSON
GET /items/_search
{
  "query": {
    "match_all": {
      
    }
  }
}
```

### 叶子查询

![](/images/notes/Screenshot 2026-02-22 143251.png)

- 全文检索
```JSON
GET /{索引库名}/_search
{
  "query": {
    "match": {
      "字段名": "搜索条件"
    }
  }
}
```

- 精确搜索
**一般用来搜keyword字段**
```JSON
GET /{索引库名}/_search
{
  "query": {
    "term": {
      "字段名": {
        "value": "搜索条件"
      }
    }
  }
}
```

- 范围查询
```JSON
GET /{索引库名}/_search
{
  "query": {
    "range": {
      "字段名": {
        "gte": {最小值},
        "lte": {最大值}
      }
    }
  }
}
```

### 复合查询

![](/images/notes/Screenshot 2026-02-22 150856.png)

### 排序
**默认以相关度算出score来排序**

如果有多个字段，则先按照第一个字段排序，再排第二个
```JSON
GET /indexName/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "排序字段": {
        "order": "排序方式asc和desc"
      }
    }
  ]
}
```

### 分页
```JSON
GET /items/_search
{
  "query": {
    "match_all": {}
  },
  "from": 0, // 分页开始的位置，默认为0
  "size": 10,  // 每页文档数量，默认10
  "sort": [
    {
      "price": {
        "order": "desc"
      }
    }
  ]
}
```

## 聚合

![](/images/notes/Screenshot 2026-02-22 151849.png)

