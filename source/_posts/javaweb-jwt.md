---
title: "JwT"
date: 2025-09-15
categories:
  - JavaWeb
tags:
  - JWT
  - 认证
  - 安全
---

```java

生成令牌

@Test  
public void test() {  
    Map<String, Object> dataMap=new HashMap<>();  
    dataMap.put("username","admin");  
    dataMap.put("password","123456");  
    String token =Jwts.builder().signWith(SignatureAlgorithm.HS256, "aXRoZWltYQ==")  ->设置编码，以及密钥
            .addClaims(dataMap)  ->储存自己的数据
            .setExpiration(new Date(System.currentTimeMillis()+1000*60*60*24))  ->有效期
            .compact();  
    System.out.println(token);  
}
//eyJhbGciOiJIUzI1NiJ9.  
编码算法->可解码
// eyJwYXNzd29yZCI6IjEyMzQ1NiIsInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE3NTgwMDkzODh9.  
自定义的用户的数据（base64编码过后）->可解码
// nQJq3l4A-htPs14FQklG9uWgeV-wAXjwseflUiaZuk0
结合前面两部分以及自定义的密钥生成的->不可解码


解析令牌

@Test  
public void test2() {  
    String token ="eyJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6IjEyMzQ1NiIsInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE3NTgwMDkzODh9.nQJq3l4A-htPs14FQklG9uWgeV-wAXjwseflUiaZuk0";  
    Claims  claims = Jwts.parser().setSigningKey("aXRoZWltYQ==")  
            .parseClaimsJws( token)  
            .getBody();  
    System.out.println(claims);  
}
Claims本质就是Map
```

