hexo.extend.filter.register('after_render:html', function(data) {
  const root = hexo.config.root;
  const site = hexo.locals.toObject();

  // ===== HOMEPAGE =====
  if (data.includes('"isHome":true')) {
    const heroCss = `<style>
.sidebar{display:none!important}
.sidebar-toggle{display:none!important}
.content-wrap{margin-left:0!important;padding:0 40px!important}
.posts-expand{display:none!important}
.post-block{display:none!important}
.post-header{display:none!important}
.main-inner{max-width:900px;margin:0 auto}
.hp{padding:60px 0 40px;text-align:center}
.hp-avatar{width:80px;height:80px;border-radius:50%;border:3px solid #e8e8e8;box-shadow:0 2px 12px rgba(0,0,0,0.06);margin-bottom:12px}
.hp-name{font-size:22px;font-weight:700;color:#222;margin:0 0 4px}
.hp-sub{color:#999;font-size:13px;margin:0 0 36px}
.hp-section{margin-bottom:32px;text-align:left}
.hp-label{font-size:13px;color:#999;margin-bottom:14px;text-transform:uppercase;letter-spacing:1px;font-weight:600}
.contact-list{display:flex;flex-wrap:wrap;gap:12px}
.cl{display:flex;align-items:center;gap:8px;padding:10px 18px;background:#f8f9fa;border-radius:10px;font-size:13px;color:#444;border:1px solid #eee;transition:all 0.2s}
.cl:hover{border-color:#ddd;background:#f0f0f0}
.cl i{color:#666;font-size:14px;width:16px;text-align:center}
.cl a{color:#444;text-decoration:none}
.cl-label{color:#999;font-size:12px;margin-right:4px}
.tech-list{display:flex;flex-wrap:wrap;gap:10px}
.tk{display:flex;align-items:center;gap:6px;padding:10px 16px;background:#f8f9fa;border-radius:10px;font-size:13px;color:#444;border:1px solid #eee;transition:all 0.2s}
.tk:hover{border-color:#ddd;background:#f0f0f0}
.tk i{color:#666;font-size:13px}
.nav-list{display:flex;gap:14px}
.nl{flex:1;display:block;padding:24px;background:#f8f9fa;border-radius:12px;border:1px solid #eee;text-decoration:none;color:inherit;transition:all 0.2s}
.nl:hover{border-color:#ccc;background:#f0f0f0;transform:translateY(-2px)}
.nl h3{font-size:16px;color:#222;margin:0 0 6px}
.nl p{font-size:12px;color:#999;margin:0}
.header{display:none!important}
.hp-nav{display:flex;justify-content:center;gap:16px;margin-bottom:36px}
.hp-nav a{padding:8px 20px;border-radius:8px;font-size:13px;color:#666;text-decoration:none;border:1px solid #eee;background:#f8f9fa;transition:all 0.2s}
.hp-nav a:hover{background:#f0f0f0;color:#222;border-color:#ddd}
</style>`;
    const hero = `<div class="hp">
<img src="${root}images/avatar.jpg" class="hp-avatar" alt="avatar">
<h1 class="hp-name">XK</h1>
<p class="hp-sub">后端开发工程师 | Java</p>
<div class="hp-nav">
<a href="${root}">首页</a>
<a href="${root}notes/">笔记</a>
<a href="${root}projects/">项目</a>
</div>
<div class="hp-section">
<div class="hp-label">联系方式</div>
<div class="contact-list">
<div class="cl"><i class="fa fa-qq"></i><span class="cl-label">QQ:</span>2496651494</div>
<div class="cl"><i class="fa fa-envelope"></i><span class="cl-label">邮箱:</span>kqf664@gmail.com</div>
<div class="cl"><i class="fa fa-envelope"></i><span class="cl-label">邮箱:</span>2496651494@qq.com</div>
<div class="cl"><i class="fa fa-github"></i><span class="cl-label">GitHub:</span><a href="https://github.com/xk664" target="_blank">github.com/xk664</a></div>
</div>
</div>
<div class="hp-section">
<div class="hp-label">技术栈</div>
<div class="tech-list">
<div class="tk"><i class="fa fa-database"></i> MySQL</div>
<div class="tk"><i class="fa fa-bolt"></i> Redis</div>
<div class="tk"><i class="fa fa-leaf"></i> Spring Boot</div>
<div class="tk"><i class="fa fa-code-fork"></i> MyBatis</div>
<div class="tk"><i class="fa fa-cloud"></i> Spring Cloud Alibaba</div>
<div class="tk"><i class="fa fa-tasks"></i> JUC</div>
<div class="tk"><i class="fa fa-cogs"></i> JVM</div>
<div class="tk"><i class="fa fa-envelope-o"></i> RabbitMQ</div>
<div class="tk"><i class="fa-brands fa-docker"></i> Docker</div>
<div class="tk"><i class="fa-brands fa-git-alt"></i> Git</div>
<div class="tk"><i class="fa-brands fa-linux"></i> Linux</div>
</div>
</div>
</div>`;
    data = data.replace('</head>', `${heroCss}</head>`);
    data = data.replace(/<div class="main-inner/, `${hero}<div class="main-inner`);
    // Remove post list entirely
    data = data.replace(/<div id="posts"[\s\S]*?<\/main>/, '</main>');
  }

  // ===== ABOUT PAGE =====
  if (data.includes('<title>关于我')) {
    data = data.replace(/<aside class="sidebar"/, '<aside class="sidebar" style="display:none"');
    data = data.replace(/<div class="post-body">\s*<\/div>/, `<div class="post-body"><style>.sidebar{display:none!important}.content-wrap{margin-left:0!important}</style></div>`);
  }

  // ===== NOTES PAGE =====
  if (data.includes('<title>学习笔记') && data.includes('post-body')) {
    const categories = [
      { name: 'JUC', title: 'JUC - Java 并发编程' },
      { name: 'JVM', title: 'JVM - Java 虚拟机' },
      { name: 'MySQL', title: 'MySQL - 数据库' },
      { name: 'Redis', title: 'Redis - 缓存中间件' },
      { name: 'SSM', title: 'SSM - Spring 全家桶' },
      { name: 'SpringCloud', title: 'SpringCloud - 微服务' },
      { name: 'JavaWeb', title: 'JavaWeb - Web 开发' },
      { name: 'Java集合', title: 'Java 集合框架' },
      { name: 'IO流', title: 'IO 流' },
      { name: '黑马点评', title: '黑马点评 - Redis 实战' },
      { name: '拼团交易平台', title: '拼团交易平台 - 微服务实战' },
      { name: '面试', title: '面试八股文' },
      { name: '算法', title: '算法与数据结构' },
      { name: '计算机设计大赛', title: '计算机设计大赛' },
    ];

    let sections = '';
    categories.forEach(cat => {
      const catData = site.categories.findOne({name: cat.name});
      if (!catData || catData.length === 0) return;
      const sorted = catData.posts.sort('date', -1);
      let items = '';
      sorted.forEach(post => {
        items += `<a href="${root}${post.path}" class="np">${post.title}</a>`;
      });
      sections += `<div class="nc"><div class="nc-hd"><span class="nc-title">${cat.title}</span><span class="nc-count">${sorted.length} 篇</span></div><div class="nc-list">${items}</div></div>`;
    });

    const css = `<style>
.sidebar{display:none!important}
.content-wrap{margin-left:0!important}
.main-inner{max-width:900px;margin:0 auto}
.header{display:none!important}
.post-header{display:none}
.post-block{padding:0;background:transparent!important}
.container .main-inner{background:transparent!important;padding:0!important}
.back-home{display:inline-flex;align-items:center;gap:6px;margin-bottom:24px;padding:8px 16px;border-radius:8px;font-size:13px;color:#666;text-decoration:none;border:1px solid #eee;background:rgba(248,249,250,0.9);transition:all 0.2s}
.back-home:hover{background:#f0f0f0;color:#222;border-color:#ddd}
.np-wrap{padding:40px 0}
.np-notice{background:rgba(250,250,250,0.9);border-left:3px solid #e0e0e0;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:30px;font-size:13px;color:#888;line-height:1.8}
.np-notice a{color:#444;font-weight:600;border-bottom:1px dashed #999}
.nc{margin-bottom:24px;background:#f8f9fa;border-radius:12px;border:1px solid #eee;overflow:hidden}
.nc-hd{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid #eee}
.nc-title{font-size:15px;font-weight:600;color:#333}
.nc-count{font-size:12px;color:#aaa}
.nc-list{padding:6px 0}
.np{display:flex;align-items:center;padding:10px 20px;color:#444;text-decoration:none;font-size:13px;transition:all 0.2s;border-bottom:1px solid transparent}
.np:last-child{border-bottom:none}
.np:hover{background:#f0f0f0;color:#222}
.np-date{font-size:12px;color:#aaa;margin-right:16px;flex-shrink:0}
</style>
<div class="np-wrap">
<a href="${root}" class="back-home"><i class="fa fa-arrow-left"></i> 返回首页</a>
<div class="np-notice">&#9888; 由于没有购买阿里云OSS，部分笔记图片显示不完整，完整笔记请移步 <a href="https://blog.csdn.net/2403_88478303?type=blog" target="_blank">CSDN 博客</a></div>
${sections}
</div>`;
    data = data.replace(/<div class="post-body">\s*<\/div>/, `<div class="post-body">${css}</div>`);
  }

  // ===== PROJECTS PAGE =====
  if (data.includes('<title>项目展示') && data.includes('post-body')) {
    const projects = [
      { name: '拼团交易平台', lang: 'Java', tech: 'Spring Cloud Alibaba / MySQL / Redis / RabbitMQ', desc: '一个完整的拼团电商交易平台，采用微服务架构设计。核心亮点是自研规则树引擎，通过树形结构替代大量 if-else 业务判断，实现了灵活的活动规则配置。支持拼团活动创建、用户参团、订单生成、支付回调等完整业务流程。', features: ['Spring Cloud Alibaba 微服务治理', '自研规则树引擎', 'Redis 分布式锁与缓存', 'RabbitMQ 异步消息处理', 'MySQL 分库分表'], link: 'https://github.com/xk664/group-buy-market-xk' },
      { name: 'AI Agent Draw.io', lang: 'Java + TypeScript', tech: 'Spring Boot / Vue / Draw.io / AI SDK', desc: 'AI Agent 驱动的智能绘图平台，前后端分离架构。后端基于 Spring Boot 构建 AI Agent 服务，集成大模型能力实现自然语言生成图形；前端基于 Draw.io 开源绘图引擎，支持流程图、架构图等多种图形的可视化编辑与导出。', features: ['AI Agent 智能对话生成图形', 'Draw.io 可视化编辑器', '前后端分离 RESTful 架构', '大模型 API 集成'], link: 'https://github.com/xk664/agent-draw-io-xk-backend' },
      { name: 'AI Agent 脚手架', lang: 'Java', tech: 'Spring Boot / AI SDK', desc: 'AI Agent 快速开发脚手架工程，封装了通用的 Agent 对话、工具调用、记忆管理等核心能力。开发者只需关注业务逻辑，即可快速搭建具备 AI 能力的应用，大幅降低 AI Agent 开发门槛。', features: ['通用 Agent 能力封装', '工具调用链路', '会话记忆管理', '快速接入大模型'], link: 'https://github.com/xk664/ai-agent-archetype-xk' },
      { name: '苍穹外卖', lang: 'Java', tech: 'Spring Boot / MyBatis / MySQL / Redis / 微信小程序', desc: '外卖点餐全栈项目，包含用户端微信小程序和管理端 Web 后台。实现了菜品分类管理、购物车、下单支付、订单状态流转、地址管理等完整业务。使用 Redis 缓存热门菜品和用户会话，大幅提升了接口响应速度。', features: ['Spring Boot + MyBatis 后端', '微信小程序用户端', 'Redis 缓存优化', '订单状态机设计'], link: 'https://github.com/xk664/sky-take-out' },
      { name: '黑马点评', lang: 'Java', tech: 'Spring Boot / Redis / MySQL', desc: '仿大众点评实战项目，重点练习 Redis 在高并发场景下的应用。深入实践了缓存穿透、缓存击穿、缓存雪崩的解决方案，实现了分布式锁、用户签到、好友关注、附近商户等核心功能。', features: ['缓存穿透/击穿/雪崩解决方案', 'Redisson 分布式锁', 'GEO 附近商户搜索', '用户签到与 BitMap'], link: 'https://github.com/xk664/hmComment' },
      { name: 'TLAS 管理系统', lang: 'Java', tech: 'Spring Boot / MyBatis / MySQL / JWT', desc: '企业级后台管理系统，实现了员工管理、部门管理、权限控制等基础功能。采用 JWT 无状态认证，支持角色权限粒度控制。项目涵盖 RESTful API 设计、统一异常处理、参数校验等企业开发最佳实践。', features: ['JWT 无状态认证', 'RBAC 权限控制', 'RESTful API 设计', '统一异常处理'], link: 'https://github.com/xk664/tlias' }
    ];

    let cards = '';
    projects.forEach(p => {
      const feats = p.features.map(f => `<li>${f}</li>`).join('');
      cards += `<div class="pc"><div class="pc-hd"><h3>${p.name}</h3><div class="pc-meta"><span class="pc-lang">${p.lang}</span><span class="pc-tech">${p.tech}</span></div></div><p class="pc-desc">${p.desc}</p><ul class="pc-feats">${feats}</ul><a href="${p.link}" target="_blank" class="pc-link"><i class="fa fa-github"></i> 查看源码</a></div>`;
    });

    const css = `<style>
.sidebar{display:none!important}
.content-wrap{margin-left:0!important}
.main-inner{max-width:900px;margin:0 auto}
.header{display:none!important}
.post-header{display:none}
.post-block{padding:0;background:transparent!important}
.container .main-inner{background:transparent!important;padding:0!important}
.back-home{display:inline-flex;align-items:center;gap:6px;margin-bottom:24px;padding:8px 16px;border-radius:8px;font-size:13px;color:#666;text-decoration:none;border:1px solid #eee;background:rgba(248,249,250,0.9);transition:all 0.2s}
.back-home:hover{background:#f0f0f0;color:#222;border-color:#ddd}
.pj-wrap{padding:40px 0}
.pc{background:#f8f9fa;border-radius:12px;border:1px solid #eee;padding:24px;margin-bottom:20px;transition:all 0.2s}
.pc:hover{border-color:#ddd;background:#f0f0f0;transform:translateY(-2px)}
.pc-hd{margin-bottom:14px}
.pc-hd h3{font-size:17px;color:#222;margin:0 0 8px}
.pc-meta{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.pc-lang{background:#222;color:#fff;padding:3px 10px;border-radius:6px;font-size:11px}
.pc-tech{color:#888;font-size:12px}
.pc-desc{color:#555;line-height:1.8;font-size:13px;margin:0 0 14px}
.pc-feats{list-style:none;padding:0;margin:0 0 16px;display:flex;flex-wrap:wrap;gap:8px}
.pc-feats li{background:#fff;color:#666;padding:5px 12px;border-radius:8px;font-size:12px;border:1px solid #eee}
.pc-link{display:inline-flex;align-items:center;gap:6px;color:#444;font-size:13px;text-decoration:none;border-bottom:1px dashed #999;transition:all 0.2s}
.pc-link:hover{color:#222;border-bottom-color:#444}
</style>
<a href="${root}" class="back-home"><i class="fa fa-arrow-left"></i> 返回首页</a>
<div class="pj-wrap">${cards}</div>`;
    data = data.replace(/<div class="post-body">\s*<\/div>/, `<div class="post-body">${css}</div>`);
  }

  return data;
});
