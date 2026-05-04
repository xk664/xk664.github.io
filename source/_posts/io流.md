---
title: "字节流"
date: 2025-10-15
categories:
  - IO流
tags:
  - Java
  - IO
  - 文件
---

 # 字节流

**OutputStream和InputStream时抽象类，不能实例化对象**

**特点：每次读取固定字节数，当既有中文又有英文时容易出现乱码**
## 1.FileOutputStream

**格式：**
```
FileOutputStream fos=new FileOutputStream(参数1，参数2);  
fos.write(内容);  
fos.close();
```

**细节：**

	创建对象：
	1.参数1可以为路径或者File对象
	2.如果文件不存在会自动创建，但必须保证父级路径存在
	3.会清空原来的内容
	4.参数2为续写开关，默认为false（会清空原来的），手动加为true后，会接着写，不会清空
	5.子路径只能为文件

	写数据:
	write(int b);
	write(byts[] b);//一次写多个，配合String的getBytes()
	write(byts[] b,int off,int len)//off:起始索引 len:长度
	write()参数为整数，在文件上表现为其ascii码对应的字符

	释放资源：
	如果不释放，Java会一直占用这个文件
	
**拓展：**

	换行写：（"\r\n"）
	String s="\r\n";
	write(s.getBytes());
## 2.FileInputStream


**格式：**
```
FileInputStream fis=new FileInputStream("test.txt");  
int b=fis.read();  
System.out.println(b);  
fis.close();
```

**细节：**

	创建对象：
	参数可以为路径或者File对象

	读数据：
	1.从第一个开始读，且返回字符对应的ascii码
	2.如果读完了，继续读，则会返回-1
	3.read(byte[] b)//一次将数组读满位置，与数组长度有关，返回值为读到的字符个数，如果一个都没有读到，则返回-1
		注：第二次读到b中后，b原来的不会清空，只会被覆盖
	4.read()//一次读取一个字节，返回值为该字符的ascii码

## 字节缓冲输入流
### 1.BufferredInputStream

**特点：比File....基本流更快**

**原理：在第一次调用read()时，底层会将数据传输到缓冲区（默认为8192byte),然后后面读取时，直接从缓冲区读取，待缓冲区读完后，就继续从文件加载到缓冲区（清空缓冲区），然后继续读缓冲区，因为频繁的和磁盘操作，为耗费大量时间，而缓冲区可以减少和磁盘的io操作**

**细节：**

	初始化：
	1.BufferedInputstream fis=new BuffreddInoutstream(FileInputStream);
	读数据：
	1.read()//从缓冲区一次读取一个字节；
	2.read(byte[])//从缓冲区一次读取多个字节；
### 2.BufferedOutputStream

**特点：比File....基本流更快**

**原理：在第一次调用write()时，底层会将数据传输到缓冲区（默认为8192byte),然后后面读取时，直接从缓冲区读取，待缓冲区读满后，就将缓冲区的数据加载到磁盘（清空缓冲区），然后继续读缓冲区，因为频繁的和磁盘操作，为耗费大量时间，而缓冲区可以减少和磁盘的io操作**

**细节：**

	初始化：
	1.BufferedOutputstream fis=new BuffredoutPutstream(FileOutputStream);
	
	读数据：
	1.write()//从缓冲区一次输出一个字节；
	2.write(byte[])//从缓冲区一次输出多个字节；
# 字符流

**特点：可根据中英文，改变读取字节数**

Reader和Writer为抽象类

## 1.FileReader
**格式：**
```
FileReader fr=new FileReader(参数1，Charset.forName("GBK"));  
int ch;  
while((ch=fr.read())!=-1){  
    System.out.print((char)ch);  
}  
fr.close();
```

**细节：**

	初始化：
	1.参数一可以为path或者File
	2.参数二指定编码方式，默认为IDE的

	读数据：
		read()//底层也为字节流，只不过可以根据读到的字符改变读取字节数，会将该字符对应的二进制转化为十进制返回（中文会先去除每一个字节前面的10，再转化为十进制）,读完之后返回-1
		read(char[] c)//指定每次读入多少字符，返回值为读入的个数，读完时返回-1

## 2.FileWriter

**格式：**
```
FileWriter fw=new FileWriter("a.txt",true);  
fw.write("\r\n亢权福");  
fw.close();
```

**细节：**

	创建对象：
	1.参数1可以为路径或者File对象
	2.如果文件不存在会自动创建，但必须保证父级路径存在
	3.会清空原来的内容
	4.参数2为续写开关，默认为false（会清空原来的），手动加为true后，会接着写，不会清空
	5.子路径只能为文件

	写数据：
	1.write(String)
	2.write(String,int st,int len)
	3.write(char[],int st,int len)
	4.write(char[])
	
## 字符缓冲输出流
### 1. BufferedReader

**格式：**
```
BufferedReader br =new BufferedReader(new FileReader("a.txt"));  
BufferedWriter bw =new BufferedWriter(new FileWriter("copy.txt",true));  
String s;  
while((s=br.readLine())!=null){  
    System.out.println(s);  
    bw.write(s);  
  
}  
bw.close();  
br.close();
```

**细节：**

	读数据：
	1.readLine()//一次读取一整行（读到回车为止，但不会包含回车），返回值为该行，读完则返回null

### 2.BufferedWriter

与FileWriter不同的是：

	可用newLine()换行，可跨平台
	bw.newLine();

# 转换流

## 1.OutputStreamWriter

**格式：**
```
OutputStreamWriter osw=new OutputStreamWriter(new FileOutputStream("a.txt"), Charset.forName("GBK"));  
osw.write("");  
osw.close();
```

**细节：**

	初始化：
	1.参数二为指定写入编码方式
	2.参数1就是要转化的字节流

## 2.InputStreamReader



# 序列化流

**将对象写到硬盘**

**特点：看不懂**

**格式：**

```
actor a=new actor("亢","18");  
ObjectOutputStream oos=new ObjectOutputStream(new FileOutputStream("a.txt"));  
oos.writeObject(a);  
oos.close();
```

**细节：**

注：`对象必须要实现Serializable接口`

	初始化：
	1.参数为FileOutputStream

	写对象：
	1.writeObject(对象)
	2.writeObject(list)//将要写入的对象加入数组，一次性写完

# 反序列化流

**将对象从硬盘写到内存**

**格式：**

```
ObjectInputStream ois=new ObjectInputStream(new FileInputStream("a.txt"));  
actor a=(actor) ois.readObject();  
ois.close();  
System.out.println(a);
```

**细节：**

	读数据:
	1.ois.readObject()//返回值为Object,想要得到想要的，注意强转
	2.ArrayList<Student> list=(ArrayList<Student>) readObject();//将文件里面所有对象读入数组

**注意：**

	如果此时给对象多加一个属性后，重新反序列化读出原来的对象，Java会认为这是两个不同的类，因为serialVersionUID变了，serialVersionUID不同，所以就会认为不是同一个类，则报错
	解决方法：
	1.在属性位置加private static final long serialVersionUID=?L,从而固定UID

# 打印流


## 1.（字节打印流）PrintStream

**和FileOutputStream差不了多少，这个可以原样输出到文件，比如97，FileOutputStream会将其转化为对应的字符，而PrintStream不会**

**格式：**
```
PrintStream ps=new PrintStream(new FileOutputStream("a.txt"),true,Charset.forName("GBK"));  
ps.println(97);  
ps.close();
```

**细节：**

	初始化：
	1.true//自动刷新,默认开启

	输出：
	1.在fileOutputWriter的write()基础上多了
	2.println()//可以原数据输出并自动换行，不会转化为字符
	3.print()//可以原数据输出(不会自动换行)，不会转化为字符
	4.printf("%d",a)//和c语言一样，%n换行
## 2.（字符打印流）PrintWriter

**有缓冲区，相对于字节打印流更快**
**与字节打印流不同的是，初始化数据时，想要自动刷新，必须指定true

**格式：**
```
PrintWriter pw=new PrintWriter(new FileWriter("a.txt"),true);  
pw.println("asljsof");  
pw.close();
```

# 解压缩流（输入）
**本质起始就是将压缩包的内容拷贝出来，但是由于是压缩包，FileInputStream无法读取，只能用ZipInputstream来读，其余和基本的拷贝差别不大**

```
public static void main(String[] args) throws IOException, ClassNotFoundException {  
    //创建一个File对象表示要解压的压缩包  
    File file=new File("aaa.zip");  
    //创建一个File对象表示解压的目的地(目录）  
    File dest=new File("D:\\xk\\Java\\JavaBasic");  
    unzip(file,dest);  
}  
  
private static void unzip(File file, File dest) throws IOException {  
    ZipInputStream zip=new ZipInputStream(new FileInputStream(file));  
    ZipEntry entry;  
    while((entry=zip.getNextEntry())!=null){  
        if(entry.isDirectory()){  
            File temp=new File(dest,entry.getName());  
            temp.mkdirs();  
        }  
        else {  
            int b;  
            FileOutputStream fos=new FileOutputStream(dest+"\\"+entry.getName());  
            while((b=zip.read())!=-1){  
                fos.write(b);  
            }  
            fos.close();  
            zip.closeEntry();  
        }  
    }  
    zip.close();  
}
```
# 压缩流（输出）


