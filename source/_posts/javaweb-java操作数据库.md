---
title: "JDBC"
date: 2025-09-06
categories:
  - JavaWeb
tags:
  - Java
  - JDBC
  - 数据库
---

# JDBC

```java
package com.xk;  
  
import org.junit.jupiter.api.Test;  
  
import java.sql.Connection;  
import java.sql.DriverManager;  
import java.sql.SQLException;  
import java.sql.Statement;  
  
public class JdbcTest {  
    @Test  
    public void testUpdate() throws ClassNotFoundException, SQLException {  
        //注册驱动  
        Class.forName("com.mysql.cj.jdbc.Driver");  
        //获取数据库链接  
        String url="jdbc:mysql://localhost:3306/web01";  
        String user ="root";  
        String password="1234";  
        Connection connection = DriverManager.getConnection(url, user, password);  
        //获取SQL对象执行语句  
        Statement statement=connection.createStatement();  
        //执行SQL  
        int i=statement.executeUpdate("update user set age =24 where id=1");  
        //释放资源  
        statement.close();  
        connection.close();  
    }  
}
```

 

# Mybatis

spring boot +Mybatis

**操作步骤：**
![](/images/notes/Screenshot_2025-09-06-16-12-53-156_tv.danmaku.bil.jpg)


 - @mapper:会为这个接口动态生成实现类，并加入IOC,用的时候直接配合@AutoWired调用
==注：@Select的返回值就是一列数据，可以自动封装为User对象，而其他三个注解返回值为Integer,也可以直接void==


```java
package org.example;  
  
import org.example.mapper.UserMapper;  
import org.example.pojo.User;  
import org.junit.jupiter.api.Test;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.boot.test.context.SpringBootTest;  
  
import java.util.List;  
import java.util.Scanner;  
  
@SpringBootTest  
class MybatisDemoApplicationTests {  
    @Autowired  
    private UserMapper userMapper;  
    @Test  
    public void testFindAll()  
    {  
        User user =new User(null,"admin","1234","admin",18);  
        userMapper.findAll(user);  
    }  
  
  
}
```

### 增删改查操作

#### delete

- 需求：根据ID删除用户信息
    
- SQL：delete from user where id = 5;
    
- Mapper接口方法：
    
    - 方式一：
        
    
    ```Java
    /**
     * 根据id删除
     */
    @Delete("delete from user where id = 5")
    public void deleteById();
    ```
    

这种方式执行删除操作，调用deleteById方法只能删除id为5的用户信息，因为将id直接写死在代码中了，不可取。

- 方式二：
    

```Java
/**
 * 根据id删除
 */
@Delete("delete from user where id = #{id}")
public void deleteById(Integer id);
```

在Mybatis中，我们可以通过参数占位符号 `#{...}` 来占位，在调用`deleteById`方法时，传递的参数值，最终会替换占位符。

- 编写单元测试方法进行测试
    
      在单元测试类中,增加如下测试方法.
    
    ```Java
    @Test
    public void testDeleteById(){
        userMapper.deleteById(36);
    }
    ```

- 占位符
-- Mybatis的提供的符号，有两个，一个是 `#{...}`，另一个是 `${...}`，区别如下：
    
|   |   |   |   |
|---|---|---|---|
|符号|说明|场景|优缺点|
|#{…}|占位符。执行时，会将#{…}替换为?，生成预编译SQL|参数值传递|安全、性能高 （推荐）|
|${…}|拼接符。直接将参数拼接在SQL语句中，存在SQL注入问题|表名、字段名动态设置时使用|不安全、性能低|

**那在企业项目开发中，强烈建议使用 #{...} 。**

#### insert

- Mapper接口：
    

```Java
/**
 * 添加用户
 */
@Insert("insert into user(username,password,name,age) values(#{username},#{password},#{name},#{age})")
public void insert(User user);
```

如果在SQL语句中，我们需要传递多个参数，我们可以把多个参数封装到一个对象中。然后在SQL语句中，我们可以通过`#{对象``属性``名}`的方式，获取到对象中封装的属性值。


#### update

- 需求：根据ID更新用户信息
    
- SQL：update user set username = 'zhouyu', password = '123456', name = '周瑜', age = 20 where id = 1；
    
- Mapper接口方法：
    

```Java
/**
 * 根据id更新用户信息
 */
@Update("update user set username = #{username},password = #{password},name = #{name},age = #{age} where id = #{id}")
public void update(User user);
```

#### select

- 需求：根据用户名和密码查询用户信息
    
- SQL：select* fromuser whereusername = 'zhouyu' and password = '123456'
    
- Mapper接口方法：
    

```Java
/**
 * 根据用户名和密码查询用户信息
 */
@Select("select * from user where username = #{username} and password = #{password}")
public User findByUsernameAndPassword(@Param("username") String username, @Param("password") String password);
```

@param注解的作用是为接口的方法形参起名字的。（由于用户名唯一的，所以查询返回的结果最多只有一个，可以直接封装到一个对象中）

==因为编译后，方法的形参的名字是不可见的，所以不知道你传入的参数那个是占位符中的username,所以要用@Param来取名字==



