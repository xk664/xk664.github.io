---
title: "登录语法"
date: 2025-12-08
categories:
  - MySQL
tags:
  - MySQL
  - SQL
  - 数据库
---

## 登录语法

```Java
mysql -u用户名 -p密码 [-h数据库服务器的IP地址 -P端口号]
```
	//端口默认为3306

**例子：**

	mysql -hxxxx -Pxxx -uxxx -pxxx



## DDL(数据定义语言)

	命令行：
	1.show databases;//查看所有数据库
	2.select database();//查询当前数据库
	3.use 数据库名;//使用/切换数据库
	4.create database [if n ot exists] 数据库名 [default charset utf8m64]默认就是她;//创建数据库
	5.drop database[if exists]数据库名；//删除数据库
注：要有分号,==中括号不加==，上述database关键字可以用schema替代

### 表操作
#### 创建
格式：
		
```SQL
create table  表名(
        字段1  字段1类型 [约束]  [comment  字段1注释 ],
        字段2  字段2类型 [约束]  [comment  字段2注释 ],
        ......
        字段n  字段n类型 [约束]  [comment  字段n注释 ] 
) [ comment  表注释 ] ;
```

- 基础字段：id 主键，create_time 创建时间，update_time 修改时间
**例子：**

```SQL
create table user(  
    id int comment 'ID,唯一标识',  
    username varchar(50) comment '用户名',  
    name varchar(10) comment '姓名',  
    age int comment '年龄',  
    gender char(1) comment '性别'  
)comment '用户信息表';
```
**效果：**
![](/images/notes/Screenshot 2025-09-05 193729.png)

#### 约束

- 概念：所谓约束就是作用在表中字段上的规则，用于限制存储在表中的数据。

- 常见约束


| 约束   | 描述                       |             |
| ---- | ------------------------ | ----------- |
| 非空约束 | 限制该字段值不能为null            | not null    |
| 唯一约束 | 保证字段的所有数据都是唯一、不重复的       | unique      |
| 主键约束 | 主键是一行数据的唯一标识，要求非空且唯一     | primary key |
| 默认约束 | 保存数据时，如果未指定该字段值，则采用默认值   | default     |
| 外键约束 | 让两张表的数据建立连接，保证数据的一致性和完整性 | foreign key |
| 检查约束 | 让输入值满足条件才可以被输入           | check       |

- 例子：
	```SQL
	create table user(  
    id int primary key comment 'ID,唯一标识',  
    username varchar(50) not null unique comment '用户名',  
    name varchar(10) not null comment '姓名',  
    age int comment '年龄',  
    gender char(1) default '男'comment '性别'  
	)comment '用户信息表';
	```

#### 数据类型

-  数值类型

|             |        |                                                      |                                                         |            |
| ----------- | ------ | ---------------------------------------------------- | ------------------------------------------------------- | ---------- |
| 类型          | 大小     | 有符号(SIGNED)范围                                        | 无符号(UNSIGNED)范围                                         | 描述         |
| TINYINT     | 1byte  | (-128，127)                                           | (0，255)                                                 | 小整数值       |
| SMALLINT    | 2bytes | (-32768，32767)                                       | (0，65535)                                               | 大整数值       |
| MEDIUMINT   | 3bytes | (-8388608，8388607)                                   | (0，16777215)                                            | 大整数值       |
| INT/INTEGER | 4bytes | (-2147483648，2147483647)                             | (0，4294967295)                                          | 大整数值       |
| BIGINT      | 8bytes | (-2^63，2^63-1)                                       | (0，2^64-1)                                              | 极大整数值      |
| FLOAT       | 4bytes | (-3.402823466 E+38，3.402823466351 E+38)              | 0 和 (1.175494351 E-38，3.402823466 E+38)                 | 单精度浮点数值    |
| DOUBLE      | 8bytes | (-1.7976931348623157 E+308，1.7976931348623157 E+308) | 0 和 (2.2250738585072014 E-308，1.7976931348623157 E+308) | 双精度浮点数值    |
| DECIMAL     |        | 依赖于M(精度)和D(标度)的值                                     | 依赖于M(精度)和D(标度)的值                                        | 小数值(精确定点数) |

- 字符串类型

|            |                       |                 |
| ---------- | --------------------- | --------------- |
| 类型         | 大小                    | 描述              |
| CHAR       | 0-255 bytes           | 定长字符串(需要指定长度)   |
| VARCHAR    | 0-65535 bytes         | 变长字符串(需要指定长度)   |
| TINYBLOB   | 0-255 bytes           | 不超过255个字符的二进制数据 |
| TINYTEXT   | 0-255 bytes           | 短文本字符串          |
| BLOB       | 0-65 535 bytes        | 二进制形式的长文本数据     |
| TEXT       | 0-65 535 bytes        | 长文本数据           |
| MEDIUMBLOB | 0-16 777 215 bytes    | 二进制形式的中等长度文本数据  |
| MEDIUMTEXT | 0-16 777 215 bytes    | 中等长度文本数据        |
| LONGBLOB   | 0-4 294 967 295 bytes | 二进制形式的极大文本数据    |
| LONGTEXT   | 0-4 294 967 295 bytes | 极大文本数据          |
	  注：char为定长字符串，意思是无论储存多少个字符，都使用固定的空间，比如char(3);
		  varchar(10),根据实际长度改变，最长不超过10

- 日期时间类型

|           |     |                                           |                     |              |
| --------- | --- | ----------------------------------------- | ------------------- | ------------ |
| 类型        | 大小  | 范围                                        | 格式                  | 描述           |
| DATE      | 3   | 1000-01-01 至 9999-12-31                   | YYYY-MM-DD          | 日期值          |
| TIME      | 3   | -838:59:59 至 838:59:59                    | HH:MM:SS            | 时间值或持续时间     |
| YEAR      | 1   | 1901 至 2155                               | YYYY                | 年份值          |
| DATETIME  | 8   | 1000-01-01 00:00:00 至 9999-12-31 23:59:59 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值     |
| TIMESTAMP | 4   | 1970-01-01 00:00:01 至 2038-01-19 03:14:07 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值，时间戳 |
|           |     |                                           |                     |              |


####  其他操作
```SQL
-- 查询当前数据库的所有表
show tables;

-- 查看指定的表结构
desc 表名 ;   -- 可以查看指定表的字段、字段的类型、是否可以为NULL、是否存在默认值等信息

-- 查询指定表的建表语句
show create table 表名 ;


-- 添加字段
alter table 表名 add  字段名  类型(长度)  [comment 注释]  [约束];

-- 比如： 为tb_emp表添加字段qq，字段类型为 varchar(11)
alter table tb_emp add  qq  varchar(11) comment 'QQ号码';


-- 修改字段类型
alter table 表名 modify  字段名  新数据类型(长度);

-- 比如： 修改qq字段的字段类型，将其长度由11修改为13
alter table tb_emp modify qq varchar(13) comment 'QQ号码';




-- 修改字段名，字段类型
alter table 表名 change  旧字段名  新字段名  类型(长度)  [comment 注释]  [约束];

-- 比如： 修改qq字段名为 qq_num，字段类型varchar(13)
alter table tb_emp change qq qq_num varchar(13) comment 'QQ号码';



-- 删除字段
alter table 表名 drop 字段名;

-- 比如： 删除tb_emp表中的qq_num字段
alter table tb_emp drop qq_num;



-- 修改表名
rename table 表名 to  新表名;

-- 比如: 将当前的emp表的表名修改为tb_emp
rename table emp to tb_emp;

-- 删除表
drop  table [ if exists ]  表名;

-- 比如：如果tb_emp表存在，则删除tb_emp表
drop table if exists tb_emp;  -- 在删除表时，表中的全部数据也会被删除。
```




## DML(数据操作语言)


#### insert

- 向指定字段添加数据
    

```SQL
insert into 表名 (字段名1, 字段名2) values (值1, 值2);
```

- 全部字段添加数据
    

```SQL
insert into 表名 values (值1, 值2, ...);
```

- 批量添加数据（指定字段）
    

```SQL
insert into 表名 (字段名1, 字段名2) values (值1, 值2), (值1, 值2);
```

- 批量添加数据（全部字段）
    

```SQL
insert into 表名 values (值1, 值2, ...), (值1, 值2, ...);
```


#### update(修改原始数据)

```SQL
update 表名 set 字段名1 = 值1 , 字段名2 = 值2 , .... [where 条件] ;

update emp set name='张三' where id=1;
```

==注：如果没有写后面的条件的话，会将表的全部内容更改为这个==


#### delete

只能删除某一行，如果要删除某一个字段值，可以用update，将属性值设为null

```SQL
delete from 表名  [where  条件] ;

例：
delete from emp where id = 1;

```

==注：如果没有指明where,则会删除整个表==


## DQL(数据查询语言)

#### 基本查询

- 查询多个字段
    

```SQL
select 字段1, 字段2, 字段3 from  表名;
```

- 查询所有字段（通配符）(不建议)
    

```SQL
select *  from  表名;
```

- 设置别名（as可以省略）
    

```SQL
select 字段1 [ as 别名1 ] , 字段2 [ as 别名2 ]  from  表名;
```

- 去除重复记录
    

```SQL
select distinct 字段列表 from  表名;
```


#### 条件查询

**语法：**

```SQL
select  字段列表  from   表名   where   条件列表 ; -- 条件列表：意味着可以有多个条件
```


学习条件查询就是学习条件的构建方式，而在SQL语句当中构造条件的运算符分为两类：

- 比较运算符
    
- 逻辑运算符
    

常用的比较运算符如下:

|                   |                         |
| ----------------- | ----------------------- |
| 比较运算符             | 功能                      |
| >                 | 大于                      |
| >=                | 大于等于                    |
| <                 | 小于                      |
| <=                | 小于等于                    |
| =                 | 等于                      |
| <> 或 !=           | 不等于                     |
| between 最小 and 最大 | 在某个范围之内(含最小、最大值)        |
| in(...)           | 在in之后的列表中的值，多选一         |
| like 占位符          | 模糊匹配(_匹配单个字符, %匹配任意个字符) |
| is null           | 是null                   |
|                   |                         |

常用的逻辑运算符如下:

|          |                 |     |     |
| -------- | --------------- | --- | --- |
| 逻辑运算符    | 功能              |     |     |
| and 或 && | 并且 (多个条件同时成立)   |     |     |
| or 或 \|  | 或者 (多个条件任意一个成立) |     |     |
| not 或 !  | 非 , 不是          |     |     |
==注意：查询为NULL的数据时，不能使用 = null 或 ！=null 。得使用 is null 或 is not null。==


#### 聚合函数

之前我们做的查询都是横向查询，就是根据条件一行一行的进行判断，而使用聚合函数查询就是纵向查询，它是对一列的值进行计算，然后返回一个结果值。（将一列数据作为一个整体，进行纵向计算）

常用聚合函数：

|       |      |
| ----- | ---- |
| 函数    | 功能   |
| count | 统计数量 |
| max   | 最大值  |
| min   | 最小值  |
| avg   | 平均值  |
| sum   | 求和   |

```SQL
select count(name) from emp;
```

==注意 : 聚合函数会忽略空值，对NULL值不作为统计。==

- count ：按照列去统计有多少行数据。
		count(1)/count(*)/count(字段)
    
    - 在根据指定的列统计的时候，如果这一列中有null的行，该行不会被统计在其中。
        
- sum ：计算指定列的数值和，如果不是数值类型，那么计算结果为0
    
- max ：计算指定列的最大值
    
- min ：计算指定列的最小值
    
- avg ：计算指定列的平均值

#### 分组查询


- 分组： 按照某一列或者某几列，把相同的数据进行合并输出。
    
    - 分组其实就是按列进行分类(指定列下相同的数据归为一类)，然后可以对分类完的数据进行合并计算。
        
    - 分组查询通常会使用聚合函数进行计算。
        

**语法：**

```SQL
select  字段列表  from  表名  [where 条件]  group by 分组字段名  [having 分组后过滤条件];
```


==字段列表一般是分组字段(根据什么来分组)+聚合函数==

#### 排序查询

**语法：**

```SQL
select  字段列表  
 from   表名   
[where  条件列表] 
[group by  分组字段 having 分组后的过滤条件] 
order  by  字段1  排序方式1 , 字段2  排序方式2 … ;
```

- 排序方式：
    
    - ASC ：升序（默认值）
        
    - DESC：降序

#### 分页查询

分页查询语法：

```SQL
select  字段列表  from  表名  limit  起始索引, 查询记录数 ;
```

- 起始索引默认为0（第一行数据)，查询记录数为每一页多少条数据

#### 执行顺序

from->where->groupby和having->字段列表->order by->limit

#### 多表查询

```sql
-- 两张表中的数据做笛卡尔积
select * from user,dept;
```

##### 内连接
```sql
-- 隐式内连接(不会显示dept_id为空的user)-->查询两张表的交集  
select * from user,dept where user.dept_id=dept.id;  
  
-- 隐式内连接(不会显示dept_id为空的user)-->查询两张表的交集  
select * from user  inner join dept  on user.dept_id=dept.id;
```
  
##### 外连接(可相互转化，一般用左连接)
```sql
-- 左外连接(因为需求是没有部门的的user也要显示，所以表示要显示出user表的所有内容，故user左表)  
select user.name,dept.dept from user left outer join dept on user.dept_id=dept.id;  
  
-- 右外连接  
select dept.dept,user.name from user right outer join dept on user.dept_id=dept.id;
```

##### 自连接(可以自己和自己连接，看成两张表)

##### 子查询
```sql
-- 查询研发部的员工姓名（标量子查询）  
select user.name from user where user.dept_id=(select id from dept where dept='研发部');  
  //列子查询
在返回值面前加all-->查询同时满足所有添加的列数据

在返回值面前加any-->查询满足其中一个添加的列数据


//行子查询
select * from emp where(salary,managerid)=(select salary,managerid from emp where=?)

//表子查询

```


## DCL(数据控制语言)

##### 创建用户

- **在A主机上执行 create user '用户名'@'ip地址' identified by '密码'
表明ip地址的主机可以听过通过该账户访问到你的数据库（配置权限）**
==%表示任意ip==

- 其他主机通过mysql -u 用户名 -h ip地址 -p访问

##### 权限控制

```sql
create user '用户名'@'ip地址' identified by '密码'//创建用户
-- （默认只能访问到两个系统数据库）

-- 修改用户密码
alter user '用户名'@'ip地址' identified with mysql_native_password by 密码

-- 查询用户所具有的权限
show grants for '用户名'@'ip';


-- 授予权限
grant all on tlias.* to '用户名'@'ip'//该用户可以访问tlias数据库中所有的表


-- 撤销权限  
revoke all on tlias.* from 'xk'@'%';
```

## 字符串函数

```sql
-- 将里面的字符串进行拼接，可以多个  
select concat('hello ','xk');  
  
-- 将字符串转化为小写  
select lower('SAHF');  
  
-- 将字符串全部转化为大写  
select upper('akjdslaks');  
  
-- 用后面的字符串拼接在前面的字符串的左边，直到长度达到n  
select lpad('xk',5,'ab');  
  
-- 用后面的字符串拼接在前面的字符串的右边，直到长度达到n  
select rpad('xk',5,'ab');  
  
-- 去除头部和尾部的空格  
select trim(' hello xk ');  
  
-- 截取字符串（索引从1开始）,从第一个开始截取，截1个  
select substring('xk',1,1);
```

## 数值函数

```sql
-- 向上取整  
select  ceil(1.1);  
  
-- 向下取整  
select floor(1.1);  
  
-- 前面的数%后面的数  
select mod(3,2);  
  
-- 生成0~1的随机数  
select rand();  
  
-- 四舍五入到几位  
select round(3.26,1);
```

## 时间函数

```sql
-- 返回当前日期  
select curdate();  
  
-- 返回当前时间  
select curtime();  
  
-- 返回日期加时间  
select now();  
  
-- 当前时间对应的Year,Mouth,day  
select  year(now());  
  
-- 往后退?year,mouth,day  
select date_add(now(),interval 70 day);  
  
-- 求两个时间的相差天数(前-后）  
select datediff('2025-10-11','2005-10-11');
```

## 流程函数

```sql
-- A为真则返回B,否则返回c  
select  if(false,1,2);  
  
-- 如果A不为空则返回A,否则返回B  
select ifnull(null,2);  
  
-- 判断,如果满足when的条件(when可以有多个)，则就走then，如果不满足，则else  
select case address when '北京' then '一线城市' else '二线城市' end from emp;
```


## 外键

```sql
-- 添加外键  
alter table user add constraint fk foreign key (emp_id) references emp(id);  
  
-- 外键删除和更新行为  
  
-- no action / restrict -->子表有数据则不能删除  
-- cascade 在删除父表数据时，也会删除/更新子表中的外键  
-- set null 在删除父表数据时，将子表中的外键设置为null  
  
-- 用法  
alter table user add constraint fk foreign key (emp_id) references emp(id) on update cascade on delete cascade ;
```

## 事务
### 四大特性

原子性，一致性，持久性，隔离性

### 个人理解
- 
		每一个事务都被存在一个日志缓冲区，
		只要执行后都会执行对应的sql
		commit相当于确定执行缓冲区的sql,然后清空（确定功能）
		rollback相当于清空缓冲区(撤销功能)

```sql
-- 查看当前事务的提交方式(1为自动提交，0为手动提交)  
select @@autocommit;  
-- 自动提交，每一个sql就是一个事务
  
-- 设置为手动提交  
set @@autocommit=0;

-- 开启事务
START TRANSACTION;
BEGIN;
```

### 直接选择多个sql执行和先开启事务在选中sql的区别?

    如果之前还有事务没有提交，后面只是单纯的选中sql执行，则会将选中的sql，加到上一个事务中，看作一个事务，相反，如果是先开启一个事务，那么底层会先将上一个事务提交了，然后再把现在的sql作为一个新事务。


### 并发导致的数据查询/更新有问题
 
![](/images/notes/Screenshot 2025-10-12 192645.png)  

### 事务的隔离级别

![](/images/notes/Screenshot 2025-10-12 192707.png)
 
```sql
  
-- 查看隔离级别  
select @@transaction_isolation;  
  
-- 设置事务隔离级别  
set session  transaction isolation level repeatable read ;
```

**脏读理解：**

	read uncommited:读取未提交的，再B事务未确定之前，其实已经执行了sql，多数据做了更改，但是只是没有确定是对这些sql进行commit还是rollback,A事务会读取到还没有commit或者rollback的数据。
	read commited:读取提交的，再B事务未确定之前，其实已经执行了sql，多数据做了更改，但是只是没有确定是对这些sql进行commit还是rollback,A事务不会读取到还没有commit的数据。

**不可重复读理解:**

	再read commited的基础上，当B事务commit后，A事务就会读到更新后的数据，这会导致A事务里，同样的查询sql，查出来的数据不一致
	解决：Repeatable Read和Serializable可以再开启A事务的时候将表原来的数据存放在缓冲区，就算B事务commit了，实际上数据已经更改了，但由于A事务读取的缓存区中的数据，所以读取到的数据一样还是最初的，当A事务也commit后，才会读取到最新的，保证了同一个事务里面，查询出来的数据是一样的

	

**幻读理解：**

	A事务的查询sql会在缓冲区中的表中执行，而更新和删除则会再实际的表中执行

	A事务查询（缓冲区）id不存在的数据的时候，没有数据返回，B事务此时正好插入了一条这个id的数据（实际的表）并Commit，此时A事务再去插入同样的id的数据（实际表），就会报错，这就叫幻读

	解决：serilizable相当于会锁定这个表给A,B想操作时，便会阻塞


## 存储引擎

### MySQL的体系结构

![](/images/notes/Screenshot 2025-10-13 212016.png)

### 存储特点

![](/images/notes/Screenshot 2025-10-15 095833.png)

**因为MyISAM被mongoDb替代，Memory被redis替代，所以只要还是InnoDB**

## 索引

[数据结构可视化](https://www.cs.usfca.edu/~galles/visualization/Algorithms.html)

### 索引概述

在 MySQL 中，索引（Index）是一种特殊的数据结构，它与表关联，用于快速定位和访问表中的数据，避免数据库执行全表扫描（遍历表中所有记录），从而显著提高查询效率。

可以将索引理解为书籍的目录 —— 就像通过目录能快速找到书中特定章节，数据库通过索引能快速定位到符合查询条件的记录。

### 索引结构


![](/images/notes/Screenshot 2025-10-15 103156.png)

- 为什么innodb选择B+Tree作为索引结构?
1.当用二叉排序树插入数据时，如果数据本身有序，插入和查询的复杂度高
2.红黑树度数最大为2,当数据量大时，树的深度很深，查找效率低
3.hash只支持等值查找，不支持范围查找
4.对于B-Tree 
	 由于非叶子节点既存索引键又存实际数据，单个节点的体积会更大
	 这意味着一次磁盘 IO 能加载的 B 树节点数量更少
	 要定位到目标数据，可能需要访问更多节点，从而触发更多次磁盘 IO

### 索引分类

![](/images/notes/Screenshot 2025-10-15 113256.png)

#### 聚集索引

1.如果存在主键，主键索引就是聚集索引(唯一)
2.不存在主键，第一个unique就是聚集索引
3.如果都不存在，innodb会自动生成一个rowid作为隐藏的聚集索引

在B+Tree的叶子点的上，储存了索引和该行的所有数据，其他非叶子节点则储存的索引
相当于一级指针
#### 二级索引
除聚集索引以外的都属于二级索引（也需要自己手动创建）
在B+Tree的叶子节点的上，储存了索引和该表的主键，其他非叶子节点则储存的二级索引，
相当于二级指针

##### 联合索引

![](/images/notes/3044348f8f8c637aa5bf5fc5281e6835.png)

   联合索引（Composite Index，又称复合索引）是由多个字段组合而成的索引，其存储结构和查询逻辑与单个字段的索引有显著差异。以 InnoDB 存储引擎为例，联合索引的存储方式可概括为 “**按字段顺序排序，叶子节点存主键**”

==**失效与否的核心：给的条件使满足条件的叶子节点必须使连续的，如果不是，只保留使满足条件的叶子节点连续的条件**==

排序规则
-  先按 `a` 字段升序排序；
- 当 `a` 字段值相同时，再按 `b` 字段升序排序；
- 当 `a` 和 `b` 字段值都相同时，最后按 `c` 字段升序排序。

所以对联合索引用select时，查询条件必须满足最左前缀法则
	例：我跳过了b字段，只有where a=? and c=?;
	因为叶子节点也是有顺序的排列的，先按第一个字段排，再按第二个排，以此类推，如果跳过了中间条件，满足条件的在叶子节点里面就不是连续的，所以只有后面的索引都会失效，MySQL会找到满足跳过条件的前面的条件的所有叶子节点，然后根据这些主键，在聚集索引的B+Tree里面找到满足a,c条件的
	
	所以该字段后面的字段查询条件失效

- 只有前面两个字段时的查询规则
	先根据这两个字段找到叶子节点的大致范围，然后遍历这些叶子节点，到第一个不满足前两个字段条件的为止，然后挑选出符合条件的

- 第一个字段为空
不会进入B+Tree查询，而是进行全表扫描（全表扫描，本质是 **扫描 “主键索引的 B+Tree 所有叶子节点”**）

### 索引语法

```sql
-- 查看索引  
show index from pay;  
  
-- 创建索引(唯一索引)  
create [unique] index index_name on pay(name);  


  
-- 创建联合索引  
create  index index_pay on pay(name,money);  
  
-- 删除索引  
drop index index_pay on pay;
```

索引创建：会根据这个字段构建一个B+Tree(二级索引)

注：可在字段后面加asc或者desc指定索引排序规则

**注意：如果一个字段没有创建索引，那么每次根据这个字段查询的sql,都会全表扫描**






#### sql性能分析

 ##### 慢查询日志

![](/images/notes/Screenshot 2025-10-16 213623.png)

```sql
-- 查询数据库服务器状态  global(全局)  session(当前会话)  
show session status like 'com_______';  
  
-- 查询慢查询开关是否开启  
show variables like 'slow_query_log';
```
##### profile详情

- 作用
帮助我们了解耗时在哪里

```sql
-- 查看当前MySQL是否支持profile  
select @@profiling;  
  
-- 开启profile  
set profiling=1;  
  
-- 查看每一条sql的耗时情况  
show profiles;  
  
-- 查看指定query_id的sql语句各个阶段的耗时  
show profile for query 30;  
  
-- 查看指定query_id的sql语句各个阶段的cpu使用情况  
show profile cpu for query 30;
```
##### explain执行计划

**查看MySQL如何执行select语句的，包括表如何连接以及连接顺序**

```sql
  
explain select * from user where id=1;  
  
desc select * from user where id=1;
```

查询结果解释

id:执行sql的顺序或者操作表的顺序(id相同，从上到下依次执行，id不同，值越大，越先执行)

seslect_type:Select的查找类型

type:表示连接类型，性能由好到差NULL->system->const->eq_ref->ref->range->index->all

possible_key:可能在这张表应用的索引，一个或者多个

key:实际用到的索引

key_len:实际用到的索引长度（该字段里面最长的长度）                                                                                                                                                     

rows:MySQL认为要查询的行数

filtered:返回的行数占需读取的百分比，越大越好·

### 索引使用


==**失效与否的核心：给的条件使满足条件的叶子节点必须使连续的，如果不是，只保留使满足条件的叶子节点连续的条件**==

**注意：
1.如果一个字段没有创建索引，那么每次根据这个字段查询的sql,都  会全表扫描
2.如果A字段有单列索引，B字段也有，select id A B from table where A=？and B=？会先根据A的单列索引，查询到满足A的id，然后再根据id去聚集索引里面去查找满足B的行，所以会回表
是否回表取决于当前索引是否拥有所有要查询的字段，没有的话，就会回表**


- 最左前缀法则

最左前缀法则（Leftmost Prefix Rule）是 **使用联合索引时必须遵循的核心规则**，本质是：联合索引的查询效率，完全依赖 “从索引第一列开始、连续不跳过” 的查询条件 —— 只有按索引列的 “最左前缀顺序” 使用（比如联合索引 (a,b,c)，用 a、a+b、a+b+c），才能利用索引的 B+Tree 有序性快速定位；一旦跳过最左列或中间列，后续索引列会失效，无法发挥快速查找作用。

- 查询范围

联合索引中出现查询范围，范围查询右侧的列索引失效 
```sql
-- c失效
select * from table where a=1 and b>30 and c=0   

```


- 索引列运算

在索引列上进行运算，该索引失效
```sql
slect * from table where substring(phone,10,2)='15';
```

- 字符串类型字段不加单引号，该索引失效

```sql
select * from table where phone=12345678;
```

- 模糊查询

如果只有尾部模糊匹配不会失效(表现在叶子节点，依旧是连续的)，如果是头部则该索引失效(表现在叶子节点是断开的)，如果是在其他位置，则该索引及其后面的索引都失效

```sql
-- 不会失效
select * from table where name='亢%'

-- 失效
select * from table where name='%福'
```

- 用or连接的条件

用or分割的条件，如果or前面的列有索引，而后面的列没有索引，则涉及的索引都不会用到

个人理解：前面的列走索引，后面的列全表扫描，这样还不如就直接一次全表扫描，所以不会用到索引

- 数据分布影响

如果MySQL评估使用索引比全表查询更慢，则不适用索引


- sql提示

当一个字段既有联合索引，又有单列索引，用sql提示指定其使用哪个索引

```sql
-- use index (建议使用该索引，具体还是有MySQL决定)
-- ignore index （不使用该索引）
-- force index (必须使用该索引)  
select * from table use index(索引名) where 条件
```


- 覆盖索引

select 后为什么少用*?

因为防止出现回表查询

- 前缀索引

作用:当字段的数据量很大

	与普通索引的创建多了一个，在字段后面加一个括号(n),n代表取前n个作为索引
```sql
create index idx_user_name on user(name(5));
```

n的确定
```sql
select count(distinct substring(字段名,1,n))/count(*) from table
-- 调节n的值，来找到满足要求的选择性，从而确定n
```




## SQL优化

==**优化的核心：给的条件使满足条件的叶子节点必须使连续的，如果不是，只保留使满足条件的叶子节点连续的条件**==

### 插入数据

- 大批量插入数据
注：主键顺序插入性能高于乱序
load指令将文件里的大量数据插入数据库
```sql
-- 登陆时加上--local-infile参数
mysql --local-infile -u root -p

-- 查看是否打开开关
select @@local_infile;

-- 开启开关
set global local_infile=1;

-- 加载数据
load data local infile '文件路径' into table 表名 filelds terminated by ',' (数据与数据之间被什么分隔) lines terminated by '\n';(行与行之间被什么分割)
```

### 主键优化

注：主键顺序插入性能高于乱序

- 页分裂（主键乱序插入）
在MySQL中，叶子节点行数据是有序的（根据主键排序），当为乱序插入时，他会找到自己应该在哪个位置，然后将该page里面比他小的取其中几个包括他自己，重新移动到新开辟的page里面，然后让该page重新指向新开辟的page

- 页合并
当删除某一个叶子节点的行数据时，只是将其标记为已删除，但实际还存在，当删除的行数据数量，超过了pageA的阈值（默认为50%），就会看该page的左右page，如果前面的page有空闲的位置，就会将pageA未被标记为已删除的数据合并到前一个page，如果前面满了，则会看其后面是否有page，那么后面的page的数据。就会合并到pageA

### order BY优化

==如果排序条件在也在叶子中就是连续的一段，就不会全表扫描==

当order by后面的字段没有索引时（叶子节点已经有序），就会触发全表扫描，将数据加入到缓冲区，再来排序

### group by优化

==如果分组条件在也在叶子中就是连续的一段，就不会全表扫描==

### limit 优化

原因：在 MySQL 中，`LIMIT` 常用于分页查询（如 `LIMIT offset, rows`），但当 `offset` 过大时（如 `LIMIT 100000, 10`），性能会急剧下降。其核心原因是：MySQL 会扫描前 `offset + rows` 条数据，再丢弃前 `offset` 条，仅返回后 `rows` 条，导致大量无效扫描

优化方向：利用有序索引（如主键、自增 ID）直接定位到 `offset` 对应的位置，避免全量扫描前 `offset` 条数据。

 **示例**

假设查询条件为 `status = 1`，且 `(status, create_time)` 是联合索引：

优化前：
先WHERE status = 1 ORDER BY create_time查找到对应的id，然后回表，最后limit 10000 10;
优化后：
先在二级索引获取到对应数据的id，然后直接回表根据id查询数据
```sql
-- 慢：全表扫描并过滤，再偏移

SELECT * FROM table WHERE status = 1 ORDER BY create_time LIMIT 100000, 10;

-- 优化：先通过覆盖索引获取主键，再回表
SELECT t.* FROM table t
INNER JOIN (
  -- 子查询仅扫描索引，获取目标行的主键（覆盖索引，速度快）
  SELECT id FROM table 
  WHERE status = 1 
  ORDER BY create_time 
  LIMIT 100000, 10
) AS sub ON t.id = sub.id;
```

### count优化
count(1)\==count(\*)>count(主键)>count(字段)

- count(主键)
innodb会遍历整个表，把每一行的主键id取出来，返回给服务层，服务层拿到后，按行进行累加

- count(字段)
innodb会遍历整个表，把每一行的主键id取出来，返回给服务层，服务层拿到后，按行进行累加（非null的才累加）

- count(1)
innodb会遍历整个表，.......

- count(\*)
不会把全部字段取出来，服务层按行累加

### update优化


	
## 视图


## 存储过程

### 优点

  **预编译与缓存机制**

 存储过程在第一次执行时会被编译，生成可执行的执行计划并缓存起来。后续调用时，数据库直接复用已缓存的执行计划，省去了重复解析 SQL 语句、生成执行计划的过程（普通 SQL 每次执行都需重新解析和编译），减少了 CPU 和 I/O 资源消耗。
    
   **减少网络传输开销**

普通 SQL 需要客户端每次发送完整的 SQL 语句到数据库服务器，而存储过程只需客户端发送调用指令（如`CALL proc_name(...)`）。对于复杂业务（需多条 SQL 协作），存储过程能将多步操作在数据库端一次性完成，大幅减少客户端与服务器之间的网络交互次数和数据传输量，尤其适合网络延迟较高的场景。

- 常用sql语句

```sql
-- 创建  
create procedure p1()  
begin  
    select count(*) from user;  
end;  
  
-- 调用  
call p1();  
  
-- 查看数据库的存储过程  
select * from information_schema.ROUTINES where ROUTINE_SCHEMA='test';  
  
-- 查看储存过程定义语句  
show create procedure p1;  
  
-- 删除存储过程  
drop procedure if exists p1;
```

**注：当在命令行用创建语句时，当到select ......;她会认为sql到这里就结束了，实际上，要在end；的分号才结束，所以要用delimiter \$$ 才代表sql结束

 ### 变量

全局变量(global)：重启MySQL后恢复,像永久修改则需要更改配置文件

会话变量(session):

```sql
-- 查看所有系统变量  
show [session|global]  variables;  
  
-- 通过模糊匹配查找  
show [session|global]  variables like '...';  
  
-- 查看指定变量  
select @@[session|global] 系统变量名  
  
  
  
-- 设置系统变量  
set [session|global] 变量名=值;  
set @@[session|global].变量名=值;
```

 用户自定义变量(只能储存一个值)
```sql
-- 赋值  
set @myname='itcast';  
set @myage :=10;  
set @mygender:='男',@myhobby:='java';  
  
-- 将查询结果赋值给变量  
select count(*) into @mycount from user;  
  
-- 使用  
select @myname,@myage,@mygender,@myhobby,@mycount;
```

局部变量

作用范围在其声明的BEGIN .....END块内
```sql
-- 定义  
declare 变量名 变量类型[default....];  
  
  
create procedure p2()  
begin  
    declare stu_count int default 0;  
    select count(*) into stu_count from user;  
    select stu_count;  
end;
```

### 语法

注意：elseif而不是else if

- if
```sql
if 条件1 then 
....
elseif 条件2 then 
...
else 
....
end if;

create procedure p3()  
begin  
    declare score int default 58;  
    declare grade varchar(3);  
    if score>=85 then set grade :='优秀';  
    elseif score>=60 then set grade :='及格';  
    else set grade :='不及格';  
    end if;  
    select grade;  
end;  
  
call p3();

```

- case
```sql
case 表达式
	when value1 then ....
	when value2 then ....
	else ....
end case;
或者
case 
	when 条件1 then ....
	when 条件2 then ....
	else ....
end case;
```

- while
满足条件进入循环
```sql
while 条件 do
	sql逻辑
end while;
```

- repeat
与while不同的是满足条件退出循环
```sql
repeat
	SQl逻辑
	until 条件
end repeat; 
```

- loop
配合：
	leave退出循环，相当于break;
	iterate:跳过当前循环，相当于continue;
```sql
create procedure p6(in n int)  
begin  
    declare total int ;  
    set total :=0;  
    sum:loop  
        if n<=0 then leave sum;  
        elseif n%2!=0 then iterate sum;  
        else set total =total+n;  
        end if;  
        set n:=n-1;  
    end loop sum;  
    select total;  
end;  
  
call p6(10);
```

- 游标
用来储存查询结果集的数据类型
注：游标必须在其他变量的后面
```sql
-- 声明游标
declare 游标名称 cursor for 查询语句

-- 打开游标
open 游标名称

-- 获取游标记录
fetch 游标名称 into 变量[,变量]


 
```

- 条件处理程序
相当于异常处理
![](/images/notes/Screenshot 2025-10-26 211025.png)


### 参数

![](/images/notes/Screenshot 2025-10-26 194714.png)

```sql
create procedure p4(in score int,out grade varchar(3))  
begin  
    if score>=85 then set grade :='优秀';  
    elseif score>=60 then set grade :='及格';  
    else set grade :='不及格';  
    end if;  
end;  
  
call p4(90,@result);  
select @result;


-- inout
create procedure p5(inout score int)  
begin  
    set score :=(score/200)*100;  
end;  
  
set  @result :=194;  
call p5(@result);  
select @result;
```

用户变量@result用于接受返回值

## 存储函数

![](/images/notes/Screenshot 2025-10-26 212328.png)

```sql
create function fun1( n int)  
returns int deterministic  
begin  
    declare total int default 0;  
    while n>0 do  
        set total:=total+n;  
        set n :=n-1;  
        end while;  
    return total;  
end;  
  
select fun1(100);
```

## 触发器

![](/images/notes/Screenshot 2025-10-26 214005.png)

- insert
当对表A执行插入操作后，将新插入的数据在插入到表B
```sql
create trigger mytrigger  
    after insert on 表A for each row  
begin  
    insert into 表B values (字段值....)-- 新数据剋用new.?,旧数据用old.?  
  
end;  
  
-- 查看  
show triggers;  
  
-- 删除触发器  
drop trigger 触发器名;
```

update和delete类似

## 锁

**个人理解：相当于锁是一些操作的称呼，不同的锁对应了不同的操作，而锁之间的是否兼容，就可以来避免操作发生冲突
排斥相当于这两个锁不能不是存在，只有等另一个锁释放
兼容，两个锁可以同时存在**



### 全局锁
对整个数据库实例进行锁，为只读状态,常用于数据库的备份
```sql
-- 加锁  
flush tables with read lock;  
  
-- 释放锁  
unlock tables;
```

### 表级锁

锁住整个表，发生锁冲突概率大，并发度低

```sql
	-- 加锁
lock tables 表名.. read/write

-- 释放锁
unlock tables 或者与客户端断开连接
```

#### 表锁

- 表共享读锁（read lock）
当前客户端只读状态，当其他客户端进行写时，则会阻塞，直到客户端释放锁
- 表独占写锁 (write lock)  
只有当前客户端可以读写操作，其他客户端既不能读也不能写，会阻塞

#### 元数据锁

当对一张表进行增删改查时，会自动加上，当要修改表结构时，会自动解开

![](/images/notes/Screenshot 2025-10-27 211322.png)

互斥:相当于两个锁不能同时存在，不然会阻塞，后面的必须等前面的锁释放 

#### 意向锁

**优点:**
当表已经存在行锁了，后面我再加一个表锁，则他会先逐行扫描，是否存在锁，再决定是否阻塞，性能极低，有了意向锁,加表锁时则不用再逐行扫描，直接看意向锁和表锁是否兼容，兼容则加，反之，则不加

1.意向共享锁(IS)
与表锁共享锁（read）兼容，与表锁排他锁互斥（write）互斥
2.意向排他锁
与（read）(write)均互斥
3.
意向锁之间不会互斥

### 行级锁

#### 行锁

![](/images/notes/Screenshot 2025-10-27 215357.png)

![](/images/notes/Screenshot 2025-10-27 215447.png)

1.当where后面的条件的字段没有索引（只能全表扫描），行锁会升级为表锁

#### 间隙锁&临键锁

==目的：防止幻读==


当给不存在的记录加锁是，为我优化为间隙锁
比如：如果一行数据id=3,下一行id=8，当update ......id=6时，会再3和8之间加间隙锁，不包括3和8，如果此时另一个事务要insert.......id=4时，会阻塞

- 当查找条件为二级索引时
例如age:1 1 1 3 3 3 5 5 5;
当update.......age=3时；
会将整体三的前后间隙以及三本身上锁，避免了出现幻读现象，因为如果不加锁，这个时候有一个age=3数据插入，本来第一次读的时候没有这个新加入的数据，第二次读时就出现了，加锁可以防止数据的插入

- 范围查询
会将返回前后间隙加锁，以及本身

## innodb

### 内存架构

- 缓冲池
缓存着磁盘上经常操作的真实数据，再执行增删改查的操作时，先操作缓冲区的数据，再以一定频率刷新到磁盘，减少了磁盘I/O，加快处理速度
- 更改缓冲区
当我新插入一些数据的时候，在主键索引的B+Tree里面虽然时顺序插入的，但是对二级索引而言，可能是随机插入，这样就会导致页分裂和页合并，就会进行磁盘I/O,有了更改缓冲区，可以直接向将数据直接插入缓冲池，然后缓冲池在以一定频率更新磁盘
- 自适应哈希


### 事务原理

- 重做日志(redo log)
包括重做日志缓冲，以及重做日志文件
如果缓冲池(内存)里面的数据在刷入磁盘的时候出错，则会使修改后的数据丢失，为了防止此类情况，内存里面的重做日志缓冲会记录更改操作，并将其保存在磁盘里的重做日志文件里面，这样可以防止缓冲读入磁盘失败而造成的数据丢失

- 回滚日志（undo log）
当事务回滚时，用于恢复数据
用于记录修改前的数据，比如我执行了insert语句，他保存的就是delete........,
当事务提交后，不会立刻删除，这些日志还会可能应用于MVCC

## MVCC

### 基本概念

![](/images/notes/Screenshot 2025-10-28 212117.png)


### 实现原理
- undo log版本链

![](/images/notes/Screenshot 2025-10-28 211912.png)


- readview
作用：决定快照读，读取那个版本
决定规则
- RC隔离级别

![](/images/notes/Screenshot 2025-10-28 212944.png)

- RR隔离级别
只在事务第一次快照读的时候生成readview，后面直接复用
