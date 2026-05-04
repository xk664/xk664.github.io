---
title: "服务器（接受请求）"
date: 2025-09-06
categories:
  - JavaWeb
tags:
  - SpringBoot
  - Web
---


# 服务器（接受请求）

```java

package com.example;  
  
import jakarta.servlet.http.HttpServletRequest;  
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.bind.annotation.RestController;  
  
@RestController  
public class RequestController {  
    @RequestMapping("/request")  
    public String  request(HttpServletRequest request){  
        //获取请求方式  
        String method = request.getMethod();  
        System.out.println("请求方式："+method);  
        //获取请求路径  
  
        String requestURL = request.getRequestURL().toString();  
        System.out.println("请求URL路径："+requestURL);  
        String requestURI = request.getRequestURI();  
        System.out.println("请求URI路径："+requestURI);  
        //获取请求协议  
        String protocol = request.getProtocol();  
        System.out.println("请求协议："+protocol);  
        //获取请求参数-name  
        String name = request.getParameter("name");  
  
        //获取请求头  
        String header = request.getHeader("Accept");  
        System.out.println("请求头："+header);  
        return "OK";  
    }  
}
```

**个人理解:**
	例：localhost:8080/request?name=亢权福

	1.@RestController表明这是个请求处理类
	2.@RequestMapping("/request") //
			当从客户端访问资源路径为/request时，方法request就会收到一个请求对象
	3.return 是返回给浏览器（前端）的响应体
	
			

**请求：**
- **请求协议：浏览器将数据以请求格式发送到服务器。包括：请求行、请求头 、请求体**

- **GET方式的请求协议：**
    

![](/images/notes/image.png)

- **请求行**(以上图中红色部分) ：HTTP请求中的第一行数据。由：`请求方式`、`资源路径`、`协议/版本`组成（之间使用空格分隔）
    
    - 请求方式：GET
        
    - 资源路径：/brand/findAll?name=OPPO&status=1
        
        - 请求路径：/brand/findAll
            
        - 请求参数：name=OPPO&status=1
            
            - 请求参数是以key=value形式出现
                
            - 多个请求参数之间使用`&`连接
                
        - 请求路径和请求参数之间使用`?`连接
            
    - 协议/版本：HTTP/1.1
        
- **请求头**(以上图中黄色部分) ：第二行开始，上图黄色部分内容就是请求头。格式为key: value形式
    
    - http是个无状态的协议，所以在请求头设置浏览器的一些自身信息和想要响应的形式。这样服务器在收到信息后，就可以知道是谁，想干什么了
        
    - 常见的HTTP请求头有:
        
        
        |   |   |
        |---|---|
        |请求头|含义|
        |Host|表示请求的主机名|
        |User-Agent|浏览器版本。 例如：Chrome浏览器的标识类似Mozilla/5.0 ...Chrome/79 ，IE浏览器的标识类似Mozilla/5.0 (Windows NT ...)like Gecko
        |Accept|表示浏览器能接收的资源类型，如text/*，image/*或者*/*表示所有；
        |Accept-Language|表示浏览器偏好的语言，服务器可以据此返回不同语言的网页；
        |Accept-Encoding|表示浏览器可以支持的压缩类型，例如gzip, deflate等。
        |Content-Type|请求主体的数据类型|
        |Content-Length|数据主体的大小（单位：字节）


# 发送响应


- 响应协议：服务器将数据以响应格式返回给浏览器。包括：**响应行** **、响应头 、响应体**
    

![](https://heuqqdmbyk.feishu.cn/space/api/box/stream/download/asynccode/?code=MzViYjE0YjJhNDNmMjllNWY5MjY1MTc5YjA0YzA3ZTVfa3B1QW9SN3p2QkNzdTBBU1kydmROT25ZaXZaOUJheG1fVG9rZW46RjRCbGJWMVA2b1V0TmR4ODVHWmNEbktabktlXzE3NTY5NzYyNTM6MTc1Njk3OTg1M19WNA)

- 响应行(以上图中红色部分)：响应数据的第一行。响应行由`协议及版本`、`响应状态码`、`状态码描述`组成
    
    - 协议/版本：HTTP/1.1
        
    - 响应状态码：200
        
    - 状态码描述：OK
        
- 响应头(以上图中黄色部分)：响应数据的第二行开始。格式为key：value形式
    
    - http是个无状态的协议，所以可以在请求头和响应头中设置一些信息和想要执行的动作，这样，对方在收到信息后，就可以知道你是谁，你想干什么
        
    - 常见的HTTP响应头有:
        
    
    ```Java
    Content-Type：表示该响应内容的类型，例如text/html，image/jpeg ；
    
    Content-Length：表示该响应内容的长度（字节数）；
    
    Content-Encoding：表示该响应压缩算法，例如gzip ；
    
    Cache-Control：指示客户端应如何缓存，例如max-age=300表示可以最多缓存300秒 ;
    
    Set-Cookie: 告诉浏览器为当前页面所在的域设置cookie ;
    ```
    
- 响应体(以上图中绿色部分)： 响应数据的最后一部分。存储响应的数据
    
    - 响应体和响应头之间有一个空行隔开（作用：用于标记响应头结束）
        

  

2. #### 响应状态码
    

|       |                                                        |
| ----- | ------------------------------------------------------ |
| 状态码分类 | 说明                                                     |
| 1xx   | 响应中 --- 临时状态码。表示请求已经接受，告诉客户端应该继续请求或者如果已经完成则忽略          |
| 2xx   | 成功 --- 表示请求已经被成功接收，处理已完成                               |
| 3xx   | 重定向 --- 重定向到其它地方，让客户端再发起一个请求以完成整个处理                    |
| 4xx   | 客户端错误 --- 处理发生错误，责任在客户端，如：客户端的请求一个不存在的资源，客户端未被授权，禁止访问等 |
| 5xx   | 服务器端错误 --- 处理发生错误，责任在服务端，如：服务端抛出异常，路由出错，HTTP版本不支持等     |
|       |                                                        |

关于响应状态码，我们先主要认识三个状态码，其余的等后期用到了再去掌握：

- `200 ok` 客户端请求成功
    
- `404 Not Found` 请求资源不存在
    
- `500 Internal Server Error` 服务端发生不可预期的错误
    

  

  

3. #### 设置响应数据
    

Web服务器对HTTP协议的响应数据进行了封装(HttpServletResponse)，并在调用Controller方法的时候传递给了该方法。这样，就使得程序员不必直接对协议进行操作，让Web开发更加便捷。

![](https://heuqqdmbyk.feishu.cn/space/api/box/stream/download/asynccode/?code=NjkyMGRjMmEyNzhlNGMyYjMyODU4MGI5YTZhNzEzODlfbVVEYzZrQ2xkREtHaXEzeWJFM0txRDlIemo1RXJOM1pfVG9rZW46UU9kdGJBc210b2pSakR4UFBjQmNQQ29ZbmxiXzE3NTY5NzYyNTM6MTc1Njk3OTg1M19WNA)

代码演示：

```Java
package com.itheima;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class ResponseController {

    @RequestMapping("/response")
    public void response(HttpServletResponse response) throws IOException {
        //1.设置响应状态码
        response.setStatus(401);
        //2.设置响应头
        response.setHeader("name","itcast");
        //3.设置响应体
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");
        response.getWriter().write("<h1>hello response</h1>");//展示在浏览器
    }

    @RequestMapping("/response2")
    public ResponseEntity<String> response2(HttpServletResponse response) throws IOException {
        return ResponseEntity
                .status(401)
                .header("name","itcast")
                .body("<h1>hello response</h1>");
    }

}
```

浏览器访问测试：

![](https://heuqqdmbyk.feishu.cn/space/api/box/stream/download/asynccode/?code=Mjk4MDcyZjkyNTJkNzY2ZWRjZjI1NTA0NDYxM2NkNTZfZlVhd3ByaTlwdHJLUG1JRjc5ZWs5bEdzZ3YwM2FHSWNfVG9rZW46UEFmM2J3d1pCbzNBdEt4cHBZQ2NIMWZTbnBoXzE3NTY5NzYyNTM6MTc1Njk3OTg1M19WNA)
		

**个人理解：如果请求处理类里面的方法参数为HttpServletResponse，不会解析请求，可以自定义响应，如果为HttpServletRequest则只能解析请求，响应为以 默认方式发到浏览器，参数可以两个都有**

# 分层解耦

**三层架构：**

	1.Controller:负责接受请求，返回响应
	2.Service:逻辑处理
	3.Dao:数据访问


**理解：三层架构之间相互依赖，当某一个架构需要调整时，后面都要跟调整，因此很难以维护**

例：
```java
@Repository  
public class UserDaoImpl implements UserDao {  
    @Override  
    public List<String> findAll() {  
        //1.读取User.txt文件  
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("User.txt");  
        ArrayList<String> lines = IoUtil.readLines(in, StandardCharsets.UTF_8, new ArrayList<>());  
        return lines;  
    }  
}


@Service  
public class UserServiceImpl implements UserService {  
    @Autowired  
    private UserDao userDao;  
    @Override  
    public List<User> findAll() {  
        List<String> lines =userDao.findAll();  
        List<User>userList=lines.stream().map(o->  
                {  
                    String[] str=o.split(",");  
                    Integer id=Integer.parseInt(str[0]);  
                    String username=str[1];  
                    String password=str[2];  
                    String name=str[3];  
                    Integer age=Integer.parseInt(str[4]);  
                    LocalDateTime updateTime=LocalDateTime.parse(str[5], DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));  
                    return new User(id,username,password,name,age,updateTime);  
                }  
        ).toList();  
        return userList;  
    }  
}



@RestController  
public class userController {  
    @Autowired  
    private UserService userService;  
    @RequestMapping("/list")  
    public List<User> list() {  
        return userService.findAll();  
    }  
}
```

如果，我的UserDaoImpl有误，需要另一个UserDaoImpl1()实现类来完成，因此这样我就回去改动三层架构中的每一个new()，解决方法：

IOC容器：- 提供一个容器，容器中存储一些对象(例：UserService对象)

**实现步骤：**

	1.将你要添加到IOC里面的类，加上注解
			Controller不用加，因为@RestController里面已经包含了她
			Service:@Service
			Dao:@Respority
	2.然后再每个实现类new()的地方将new ()删掉,并加上@Autowired
	3.启动启动类时，注解@SpringBootApplication的底层的@ComponentScan会扫描所在包及其子包，scan到上述注解的实现类就可以将其添加到IOC


**为什么？IOC可以解决**

	我将新添加的实现类还有之前的实现类都添加到了这个IOC里面，然后后续如果需要用到那个实现类的方法，@AutoWired下面的变量会自动连上这个对象


**当一个接口有多个实现类时，IOC如何判断想用哪一个？**

	1.在你想注入的实现类上面再多加一个注解@Primary,这样IOC会优先注入这个实现类
	
	2.用@Qualifier()指定你想用那个
```java
@Qualifier(类名)->默认为首字母小写
@Autowired  
private UserService userService;
```


	 3.@Resouce(name=“类名”)
```java
@Resource(name="userServiceImpl")  
private UserService userService;
```
