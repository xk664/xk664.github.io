---
title: "线程运行原理"
date: 2026-04-14
categories:
  - JUC
tags:
  - JUC
  - 多线程
  - 并发编程
---

# 线程运行原理

每个线程都有自己的栈空间，且互不干扰

**只有当所有线程都运行结束，Java进程才会结束**


# 线程的上下文切换

**概念：** 当cpu不在执行当前线程的指令，而是去执行另一个线程的指令

- 出现的原因
1.CPU的时间片用光
2.有更高优先级的线程需要执行
3.垃圾回收
4.线程自己调用wait,lock，sleep等（主动）
![](/images/notes/Screenshot 2026-01-11 202554.png)

# 常见方法

- sleep
当前线程由Runnable状态转化为TIME_WAITING
其他线程可以通过休眠线程的interrupt方法将其打断，打断后会抛出异常,又转化为RUNNABE状态

- yield
当前运行中的线程将时间片让给其他线程，其状态转化为runnable,但是如果没有其他处于runnable的线程，依旧不会将按时间片让出去

- 优先级
数字越大，优先级越高，抢到时间片的概率越大

- join()
线程等待调用这个方法的线程结束后，才继续往下执行
```java
Thread t1=new Thread("t1");
t1.start();
t1.join()//主线程运行到这里的时候，会等待t1线程运行结束后，才继续执行
```


- join(long t)
线程等待方法线程执行完，且最多等t毫秒                                                                                                                                                                                                                                                           
- interrupt ()
对处于阻塞状态的线程，会让他们抛出异常同时将打断标记重置为false ；对于运行中的线程，只是会将中断标记设置为true,依旧不会影响其正常运行，除非他调用isInterrupt方法，对他自定义做处理

- isInterrupt()
判断这个线程是否被打断，打断则返回true

- interrupted()
判断线程是否被打断，打断则返回true，且重置为false 

- park()
线程运行到这里会停止，知道其他线程将其打断,且释放锁

# 守护线程

当非守护线程执行完成，即使守护线程还有代码没有执行完，也会强制结束
```java
	t.setDaemon(true)
```

# 线程状态

![](/images/notes/Screenshot 2026-01-18 165515.png)

**注意：只有处于Runnable状态的线程，才有资格抢时间片**
1.NEW(新建状态，创建线程后但是没有start()线程)
2.Runnable(可运行状态，调用start后，nofity后)
3.BLOCKED(阻塞状态，到线程获取锁失败)
4.WAITING(等待状态，当调用wait()后)
5.TIME_WAITING(时间等待状态，当调用sleep())
6.TERMINATED(终止或销毁状态，当执行完任务后)

# Synchronized

**注意：Class对象锁和实例锁是两个不同的锁，即使代码块中发生异常，也会释放锁 **

- 基础语法
```java
synchronized(对象){
	临界区
}
```

**如果这个对象时静态变量，每个线程都是共享同一把锁，但是如果是局部变量，就相当于每个线程都有自己的锁，相互不影响**

**个人理解：** 没有拿到锁的线程，转化为BLOCK状态，且不会参与时间片的分配，这样拿到锁的线程即使时间片用光了，下一次依然还是分配给他，当锁被释放后，其他线程就从BLOCK状态转化为RUNABLE状态，且参与时间片的分配

- 加在方法上
```java
public synchronized void func(){....}
//等价于
public void func(){
	synchronized(this){
		.....
	}
}
```

## Synchronized实现原理

## 对象头格式

![](/images/notes/Screenshot 2026-01-23 151152.png)

biased_lock:偏向锁是否开启

Normal:正常状态下储存的
Biased：偏向锁状态（默认）
Lightweight Locked:轻量锁
Heavyweight ocked:重量锁
## 重量锁

![](/images/notes/Screenshot 2026-01-22 202832.png)

- monitor(监视器)---操作系统
- 对象头，每一个对象都有一个对象头

**实现流程:** 
Thread2获取锁，先到这个锁对象的对象头里面，发现他还没有关联的monitor的ownner为null,则让monitor的Owner指向这个线程，当后续线程获取锁时，通过对象头找到与其关联的monitor后，发现其Owner指向了其他线程，则获取锁失败，进入等待队列（EntryList）,且线程状态变为BLOCKED，当Owner为空时，则EntryLIst里面的线程根据竞争来获取锁

## Synchronized优化原理

**优化流程:** 轻量锁或者偏向锁（解决多次cas）-->重量锁-->自旋优化

### 轻量锁

**与重量锁相比，重量锁再获取锁时会频繁进行内核态和用户太的切换，造成极大开销，然而轻量锁只需要在用户态即可，所以无论是加锁还是解锁都优先按照轻量锁，失败后在按照重量锁**

**实现流程:** 当第一个线程获取锁的时候，通过cas操作将对象头中的markword（hashcode age.....）放在自己的栈帧中，并将对象头中的markword替换为这个线程的锁记录地址(表明这个对象已经被其他线程持有)，且状态码为00，后续就算这个线程再次获取这个锁的时候，同样会生成一个栈帧，进行cas操作(尝试将对象头的markword换过来，但是会失败)，后面的线程来之后，发现对象头状态为00说明已经被获取锁了，则会进行锁膨胀为重量锁，解锁也会优先以轻量锁的方式解锁，解锁失败后，才会按照重量锁的方式解锁

![](/images/notes/Screenshot 2026-01-23 142839.png)

### 自旋优化

**原理：** 当已经将轻量锁膨胀为重量锁之后，后面的线程获取锁时会失败，然后会进入EntryList，同时线程状态变为BLOCKED,且发发生上下文切换（消耗大），因此我们想到，不让他获取锁失败后就立即进入EntryList,而是让他多次重试（次数由底层决定），然后当达到阈值时才进入Entrylist,防止了上下文切换造成的消耗

### 偏向锁

**原理:** 轻量锁里面，当一个线程已经获取锁之后，在第二次获取锁之后，依旧会生成栈帧，同时进行cas(失败)，造成浪费，因此为了解决后面重入锁进行cas，就将对象头的原来记录的锁记录地址，替换为线程标识，这样当同一个线程获取锁的时候，只需要判断对象头中的标识是不是自己，就避免了无用的cas

**注意：** 当持有偏向锁的这个线程执行完临界区代码后，偏向锁不会由任何变化，只是栈帧会被弹出，对象头依旧存的时这个线程的id,当下一个线程尝试获取锁的时候，他会遍历对象头中储存的线程的栈帧的锁记录，如果没有指向对象头的锁记录，那么则说明之前哪个线程已经释放锁了，就直接将对象头中的这个线程id更换为这个新的线程的id

#### 撤销

- 当在偏向锁的时候，调用hashcode方法，此时会升级为轻量锁
- 当出现锁竞争的状态的时候，会升级为轻量锁，当自旋达到阈值时再升级为重量锁

## wait-notify

**注意：** 这两个方法只能再获取锁以后才可以调用

**原理：** 当某一个线程获取锁以后，monitor的Ownner会指向这个线程，当这个线程调用了这个锁对象的wait（）方法后，这个线程就会进入monitor的waitSet队列，且Ownner指向也为空（释放锁），线程状态转化为Waiting状态，当其他线程调用这个**锁对象的notify()** 方法后，会随机从waitset队列里面唤醒线程，notifyall则是唤醒所有线程

## wait与sleep区别

![](/images/notes/Screenshot 2026-01-23 170209.png)

# park&unpark

**注意:** park会是线程从RUNNABLE-->Waiting,当时他依赖的不是monitor的waitset

- 使用方法
```java
	Thread t1=new Thread(()->{  
    System.out.println("t1线程开始工作...");  
    try {  
        Thread.sleep(1000);  
    } catch (InterruptedException e) {  
        throw new RuntimeException(e);  
    }  
    System.out.println("t1 park...");  
    LockSupport.park();  
    System.out.println("t1恢复工作...");  
});  
  
t1.start();  
System.out.println("main unpark...");  
LockSupport.unpark(t1);
```

 **注意:** 当线程调用LockSupport.park()时，这个线程就会暂停，与wait()不同的是，无论unpark在park前调用还是之后调用，如果在之前的话，当线程执行到park的时候，就不会停止

- 原理
![](/images/notes/Screenshot 2026-01-26 111437.png)

如果线程调用park的时候，conut等于0,则线程会进入_mutex的_cond（阻塞队列里面）,如果此时调用了unpark,则会唤醒该线程，unpark会让count等于1，而只有count等于0的时候，才会进入队列，所以如果在park之前调用了unpark,等到下次执行park的时候由于count等于0，就不会暂停，且每当经过一个park的时候count会被重置为0,并且多次unpark也不会累加

# 线程状态转化

![](/images/notes/Screenshot 2026-01-26 123121.png)

- NEW-->RUNNABLE
当Thread对象与操作系统线程关联后，即start后

- RUNNABLE<--->WAITING
调用wait()、join()，park()后RUNNALE-->WAITING
调用interrupt(),nitifyAll(),notify(),unpark()

- RUNNALBE<--->TIMED_WAITING
调用wait(long time)、join(long time)，parkNanos(long time),sleep(long time)后RUNNALE-->WAITING
调用interrupt(),nitifyAll(),notify(),unpark()

- RUNNABLE<--->BLOCKED
当竞争锁竞争失败的线程
竞争成功的线程

- RUNNABLE--->TERMINATED
当线程执行完他的代码

# 活跃性

## 死锁

**情况:** t1线程获取了A锁以后，尝试获取锁B,t2线程获取B锁后，尝试获取锁A,两个线程互相等待，造成死锁

**解决方法：** 朝相同方向加锁，但容易出现饥饿
## 活锁

**情况：** 两个线程相互改变对方退出循环的条件。导致双方都无法退出。
**比如：** 线程1期望cnt--，一直减到小于0退出，然而线程2期望cnt++,一直加到大于20就退出，最后线程2对cnt++,线程1cnt--,导致一直无法结束

**解决方法：** 修改他们的睡眠时间，使其不一样
## 饥饿

**情况：** 多个线程竞争锁的时候，某些线程获取锁的机会特别少

# ReentrantLock

![](/images/notes/Screenshot 2026-01-26 165501.png)
可中断指的是：可以被其他线程中断

## 基础语法
![](/images/notes/Screenshot 2026-01-26 165810.png)

**注意：** lock()不可打断，只有lockInterruptibly()可以打断
```java
try{
	reentrantLock.lockInterruptibly();
}catch(){
	//打断之后的操作
}
```

## 锁超时

通过lock.tryLock()方法；
无参：如果这个时刻没有获取成功就返回false,获取成功据返回true
有参：如果在t时间内获取到锁，就返回true,反之就返回false

## 公平锁

当一个线程已经获取锁了，这个时候其他线程再次获取锁的时候就会进入阻塞队列，锁释放后，与其他锁不一样的是，锁释放后，先进入阻塞队列线程，先获取到锁


## 条件变量

![](/images/notes/Screenshot 2026-01-26 172837.png)
```java
//创建waitSet(休息室)
Condition con1=reentrantLock.newConditiond();
Condition con2=reentrantLock.newConditiond();

//进入休息室（获取锁以后）
con1.await();

//唤醒某一个休息室的线程
con1.signal();
con1.signalAll();
```



# 可见性问题

```java
 static  boolean flag = true;  
public static void main(String[] args) throws InterruptedException {  
    new Thread(()->{  
        while( flag) {  
        }  
        }  
    ).start();  
    Thread.sleep(1000);  
    System.out.println("停止线程");  
    flag = false;  
}
```

按理说子线程会停止，但实际上不会的
**原因：** 在Java内存模型中，分成了两个内存，一部分用于存放共享变量，一部分是每个线程都拥有的自己的内存，当某一个线程频繁的访问主内存的共享变量的时候，当到达阈值时，JVM会将这个频繁读取的共享变量缓存一份到这个线程的私有内存里面，之后访问都从这个缓存里面读取，所以即使flag发生更改，他还是读取的原来的值

**解决方法：** 
方法一：在变量flag前加volatile(每次都从主内存里面读)，但是在效率上有所损失

方法二：

**原理：** 当主线程获取锁后，子线程获取锁失败就会阻塞，并清空缓存
```java
static  boolean flag = true;  
    public static void main(String[] args) throws InterruptedException {  
        Object lock = new Object();  
        new Thread(()->{  
            while( true) {  
                synchronized (lock) {  
                    if(!flag) {  
                        break;  
                    }  
                }  
            }  
            }  
        ).start();  
        Thread.sleep(1000);  
        System.out.println("停止线程");  
        synchronized (lock) {  
            flag = false;  
        }  
    }  
  
}
```

# 有序性

## 指令重排

```java
static int i;
static int j;

i=....
j=....
```

Java会对赋值指令进行重新排列，单线程下没什么影响，但是在多线程下，会出现线程安全问题
**原因：** 是因为一条指令还可以分成多个指令，比如在执行a指令的时候，他的步骤里面，由一步需要等待，而CPU为了防止这种空闲，就会在等待的时候同时执行其他指令，所以导致可能是其他命令先执行

**解决：** 在某一个变量面前加volatile可以防止这个变量及其之前的指令发生重排序

# volatile原理

![](/images/notes/Screenshot 2026-01-27 172134.png)
volatile变量的回填操作就是一个屏障

**注意：如果这个线程将i+1后，还没有来得及回填，此时上下文切换，那么另一个线程读取的时候，依旧时以前的值**


**特点：
	屏障之前的指令不会重排列
	屏障之前的指令对变量的改动同步到主存
	屏障之后的指令对变量的读取，直接从主存中读取

# cas

## cas工作方式(乐观锁)

**注意：** cas的变量必须要借助volatile,因为保证我得到的最新值对其他线程可见 

**实现:**
```java
AtomicInteger balance=new AtomicInteger();
while(true){  
    int prev = balance.get();  
    int next = prev - 10;  
    if(balance.compareAndSet(prev,next)){  
        break;  
    }  
}
```

**工作流程:** 比如此时线程1要将balance减10，先获取balance目前的最新值100，目标值为90，此时线程2将100提前修改为了90，那么当cas的时候，线程1判断当前的最新值和我开始记录的最新值不一样，就会失败，继续自旋重试

**问：** 如果值没有发生改变，那么更新的时候（变量-=10），不也是一个线程安全问题吗?

**答:** 在CPU下，他将cas的操作合成了一个原子指令，保证了在cas的时候不会发生上下文切换

**问：** 为什么效率高于有锁？

**答：** 因为有锁时，当锁获取失败后，会发生上下文切换，开销更大，而无锁则是通过自旋

**使用场景：** 适用于线程少，多核CPU

# 原子数

## 原子整数
### AtomicInteger

- compareAndSet()配合while(true)使用
- incrementAndGet()---->++i
- getAndIncrement()---->i++
- get()--->获取当前值
- getAndAdd(m)--->i+=m
- updateAndget()--->进行复杂的运算
```java
AtomicInteger count = new AtomicInteger(1);  
count.updateAndGet(i->(i*30+1));  
System.out.println(count.get());
```

## 原子引用
### AtomicReference(用于保护引用数据类型)

- 使用
```java
AtomicReference<Decimal> i=new AtomicReference();
 
```

**问：** 如果A最后要修改为B,但是在过程中A->B->A->B,这样依旧修改成功，但是我们希望A到B的过程中没有其他修改，因此想到加版本号

**解决方法：**

### AtomicStampedReference(解决ABA问题)

```java
AtomicStampedReference<String> asr = new AtomicStampedReference<>("A",0);  
while(true){  
    String prev= asr.getReference();  
    int stamp = asr.getStamp();  
    String next= "B";  
    if(asr.compareAndSet(prev,next,stamp,stamp+1)){  
        break;  
    }  
}
```



## 原子数组

### AtomicIntegerArray
### AtomicLongArray


# 线程池

**注意：** 核心线程和救急线程都是采用的懒加载（用到了才创建）
![](/images/notes/Screenshot 2026-02-01 165617.png)

## ThreadPoolExecutor



### 线程池状态

**使用int的高3位表示线程池状态，低29位表示线程数量，因为这样就可以用一个原子变量（atomicInteger）一次cas操作就可以修改状态和线程数**

![](/images/notes/Screenshot 2026-02-01 165751.png)

**SHUTDOWN:** 执行完队列里面的任务以后，所有线程都会被销毁
### 构造方法

![](/images/notes/Screenshot 2026-02-01 170553.png)

**救急线程：** 当阻塞队列满了之后，此时又有新的任务尝试加入阻塞队列，那么如果线程池有救急线程，就救急线程去处理，救急线程数（最大数-核心数）,当救急线程都用光后，后面的任务就只能用拒绝策略。
**救急线程生存时间：** 当救急线程空闲下来后，开始计时，如果在这个期间没有任务，当计时达到生存时间后，这个救急线程就会被销毁，如果此时又有新任务，那么这个计时当下次空闲的时候，会重新从0开始计时

### Executors.newFixedThreadPool()

![](/images/notes/Screenshot 2026-02-01 173750.png)

### Executors.newCachedThreadPool()

![](/images/notes/Screenshot 2026-02-01 174904.png)
**Synchronous不是真正意义上的队列，他就是一个中间人，当来的任务没有线程取走的时候，则会一直等待，知道有线程消费**

**评价：** 适用于任务数量大，且单任务耗时短

### Executors.newSingleThreadPool()

![](/images/notes/Screenshot 2026-02-01 175706.png)

**设置线程数量是实现类的接口，如果不加以装饰，则可以通过强转为ThreadPoolExecutor,然后调用setCorePoolSiz()方法

### 提交任务

![](/images/notes/Screenshot 2026-02-01 202843.png)

### 关闭线程池

- shutDown()

![](/images/notes/Screenshot 2026-02-01 205248.png)

**SHUTDOWN:** 执行完队列里面的任务以后，所有线程都会被销毁

- shutDownNow()
![](/images/notes/Screenshot 2026-02-01 205618.png)

## 任务调度线程池

**概念：希望一些任务被延迟执行，一些任务被重复执行**

### Timer
**缺点：** 由同一个线程调度，前面的任务的延时会影响后面的任务

### Executors.newScheduledThreadPool(int coreSize);
如果coreSize为1，则每个任务都是串行执行，和Timer类似的
#### 延迟执行

**使用方法：** schedule(任务，延时时间，时间单位)
```java
ScheduledExecutorService pool=Executors.newScheduledThreadPool(2);
pool.schedule(()->{
System.out("hello world")},1,TimeUnit.Second);

```

#### 定时执行

```java
LocalDateTime now = LocalDateTime.now();  
LocalDateTime with = now.withHour(18).withMinute(0).withSecond(0).withNano(0).with(DayOfWeek.THURSDAY);  
if(with.isBefore(now)){  
    with = with.plusWeeks(1);  
}  
long interval = Duration.between(now, with).toMillis();//下一次执行任务和现在任务的时间差  
long period = 1000*60*60*24*7;//一周的时间  
ScheduledExecutorService executor = new ScheduledThreadPoolExecutor(1);  
executor.scheduleAtFixedRate(()->{  
    System.out.println("开始执行任务");  
},interval,period,TimeUnit.MILLISECONDS);
```

## tomcat线程池

![](/images/notes/Screenshot 2026-02-02 143747.png)

![](/images/notes/Screenshot 2026-02-02 143422.png)

### Fork/Join线程池

- 概念
![](/images/notes/Screenshot 2026-02-02 144047.png)

- 例子
```java
public class Main {  
  
    public static void main(String[] args) throws InterruptedException, ExecutionException {  
        ForkJoinPool forkJoinPool = new ForkJoinPool(16);  
        MyTask myTask=new MyTask(10);  
        Integer result =forkJoinPool.invoke(myTask);  
        System.out.println(result);  
    }  
  
}  
class MyTask extends RecursiveTask<Integer>{  
    int n;  
    public MyTask(int n){  
        this.n = n;  
    }  
    @Override  
    protected Integer compute() {  
        if(n==1)return 1;  
        MyTask myTask1 = new MyTask(n-1);  
        myTask1.fork();//执行方法  
        Integer tmp=myTask1.join();//获取结果  
        Integer result = tmp+n;  
        return result;  
    }  
}
```

# J.U.C

### AQS

**理解：** 他是一个框架（别人已经把基本结构写完，你只需要写你自定义的锁）

![](/images/notes/Screenshot 2026-02-02 154031.png)



- 例子
```java
class MyLock implements Lock {  
  
  //再自定义
    class MySync extends AbstractQueuedSynchronizer{  
        @Override  
        public boolean tryAcquire(int arg) {  
            if (compareAndSetState(0, 1)) {  
                setExclusiveOwnerThread(Thread.currentThread());  
                return true;  
            }  
            return false;  
        }  
        @Override  
        protected boolean tryRelease(int arg) {  
            setExclusiveOwnerThread(null);  
            setState(0);  
            return true;  
        }  
        @Override  
        public boolean isHeldExclusively() {  
            return getState()==1;  
        }  
  
        public Condition newCondition() {  
            return new ConditionObject();  
        }  
    }  
    MySync sync = new MySync();  
    @Override  
    public void lock() {  
        sync.acquire(1);  
    }  
  
    @Override  
    public void lockInterruptibly() throws InterruptedException {  
        sync.acquireInterruptibly(1);  
    }  
  
    @Override  
    public boolean tryLock() {  
        return sync.tryAcquire(1);  
    }  
  
    @Override  
    public boolean tryLock(long time, TimeUnit unit) throws InterruptedException {  
        return sync.tryAcquireNanos(1, unit.toNanos(time));  
    }  
  
    @Override  
    public void unlock() {  
         sync.release(1);  
    }  
  
    @Override  
    public Condition newCondition() {  
        return sync.newCondition();  
    }  
}
```

### ReentrantLock原理

**个人理解：** 还是依靠AQS框架，NonfairSync和FairSync重写了AQS里面的方法，然后ReentrantLock只是去调用了这些内部类的方法(类似于上面AQS的设计思路           )
![](/images/notes/Screenshot 2026-02-02 154425.png)

#### NonfairSync(阻塞队列中的线程会和非阻塞队列的线程竞争)

##### 获取/竞争锁原理

![](/images/notes/Screenshot 2026-02-02 162030.png)

- 基本流程
线程1获取锁成功后，将state设置为1，且Owner（不是Monitor）设置为自己,后续来的线程，获取锁失败后会加入双向链表中，且waitStatus为0，当他再次尝试获取锁且失败的时候，此时双向链表head的waitStatus设置-1（表示后续他要唤醒他后面的线程），同时这个线程被park了（阻塞）,等到锁被释放时，被他的前驱节点唤醒，然后再尝试竞争锁

#### 可重入锁原理

类似于Redisson,如果时同一个线程获取已经获取的锁的时候，就将次数+1，当释放锁的时候就-1，减到0，就应该真正的释放锁

#### 不可打断原理

再线程阻塞过程中，即使其他线程调用了打断方法打断该线程，但是这个线程并不会抛异常，而是继续等待，等到获取锁成功后，再返回这个打断标记

#### 可打断原理

其他线程调用打断方法后，该线程直接抛异常，并退出等待

#### 公平锁原理

再新来的线程来竞争锁之前，先判断队列里面是否还有其他线程，如果有，那么这个新的线程就不参与竞争，而是直接加入队列尾部，反之参与竞争

#### 条件变量原理

![](/images/notes/Screenshot 2026-02-02 165445.png)

当Owner线程await后，会进入ConditionObject的一个链表里面，并且释放所有重入次数，当其他线程调用signal后，再条件变量队列里面的线程的第一个线程就会被重新加到阻塞队列等待锁

## ReentrantReadWriteLock

**优点：** 再synchronized之前，在面对数据的读写操作的时候，我们会将整个读写操作作为一个同步代码块锁起来，但是实际上，如果两个线程都是读操作是可以并发的，因此R......就解决了

- 使用方法
```java
class Test{  
    Object data;  
    ReentrantReadWriteLock.WriteLock writeLock = new ReentrantReadWriteLock().writeLock();  
    ReentrantReadWriteLock.ReadLock readLock = new ReentrantReadWriteLock().readLock();  
  
    public Object read(){  
        readLock.lock();  
        try{  
  
            System.out.println(Thread.currentThread()+"读取数据："+data);  
            try {  
                Thread.sleep(1000);  
            } catch (InterruptedException e) {  
                throw new RuntimeException(e);  
            }  
            return data;  
  
        }finally {  
            readLock.unlock();  
        }  
    }  
    public void write(Object data){  
        writeLock.lock();  
        try{  
            System.out.println(Thread.currentThread()+"写入数据："+data);  
            try {  
                Thread.sleep(1000);  
            } catch (InterruptedException e) {  
                throw new RuntimeException(e);  
            }  
            this.data = data;  
        }finally {  
            writeLock.unlock();  
        }  
    }  
}
```

- 注意事项
1.任意的一个线程获取读锁之后，其他任何线程获取写锁的时候都会阻塞，知道读锁释放，反之亦然
2.同一个线程获取写锁之后，他自己可以再次获取读锁（锁降级）

- 原理
**state的低16位表示写锁重入次数，高16位标识读锁获取次数**
![](/images/notes/Screenshot 2026-02-02 210240.png)

当t1获取写锁的时候，会检查state的高16位是否为0，如果不为0就加锁失败，为0就加锁成功并将state的第16为加一，然后Owner指向这个线程，当t2尝试获取读锁的时候，她先判断state的低16位是否为0，为0就加锁成功，不为0就再判断，Ownner是否是自己（因为锁可降级），不是的话，加锁失败（进入队列），是的话就加锁成功

## Semaphore

**理解：** 非独占锁，锁住的共享资源可以被多个线程同时获取，只有当次数达到了阈值后，其他获取锁的线程就会阻塞，直到线程释放锁（独占锁就是size\==1的特殊情况）

- 例子
锁起来的代码块，最多可以被3个线程同时获取锁
```java
Semaphore semaphore = new Semaphore(3);  
for(int  i=1;i<=10;i++){  
        int j = i;  
        new Thread(()->{  

        try {  
            semaphore.acquire();  
        } catch (InterruptedException e) {  
            throw new RuntimeException(e);  
        }  
        try {  
            System.out.println(Thread.currentThread()+"正在执行任务："+j);  
            try {  
                Thread.sleep(1000);  
            } catch (InterruptedException e) {  
                throw new RuntimeException(e);  
            }  
        }finally {  
            System.out.println(Thread.currentThread()+"释放资源");  
            semaphore.release();  
        }  
  
    }).start();
```

## countDownLatch

**理解：** 维护一个变量，当变量减为0的时候，这个线程才可以继续往下执行，其他线程运行完对应的任务可以减1

# ConcurrentHashMap

## JDK 7下，HashMap的并发死链
