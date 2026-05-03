---
title: Vue 3 Composition API 学习笔记
date: 2026-05-01 10:00:00
categories:
  - 前端开发
tags:
  - Vue
  - JavaScript
  - 前端框架
---

## 简介

Vue 3 引入了 Composition API，这是一种全新的组件逻辑组织方式。相比 Options API，它提供了更好的代码复用和逻辑组织能力。

## 核心概念

### 1. setup() 函数

`setup()` 是 Composition API 的入口点，在组件创建之前执行：

```javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    return {
      count,
      doubleCount,
      increment
    }
  }
}
```

### 2. 响应式引用

使用 `ref()` 和 `reactive()` 创建响应式数据：

```javascript
// ref - 用于基本类型
const name = ref('张三')

// reactive - 用于对象
const state = reactive({
  count: 0,
  list: []
})
```

### 3. 计算属性

使用 `computed()` 创建计算属性：

```javascript
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})
```

### 4. 侦听器

使用 `watch()` 和 `watchEffect()` 侦听变化：

```javascript
// watch - 侦听特定数据
watch(count, (newVal, oldVal) => {
  console.log(`count changed: ${oldVal} -> ${newVal}`)
})

// watchEffect - 自动追踪依赖
watchEffect(() => {
  console.log(`count is: ${count.value}`)
})
```

## 优势

1. **更好的逻辑复用**: 通过 composables 函数复用逻辑
2. **更灵活的代码组织**: 相关逻辑可以放在一起
3. **更好的类型推断**: TypeScript 支持更友好
4. **更小的生产包体积**: Tree-shaking 友好

## 实际应用

### 自定义 Composable

```javascript
// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initialValue
  }

  return {
    count,
    increment,
    decrement,
    reset
  }
}
```

### 在组件中使用

```javascript
import { useCounter } from './useCounter'

export default {
  setup() {
    const { count, increment, decrement, reset } = useCounter(10)

    return {
      count,
      increment,
      decrement,
      reset
    }
  }
}
```

## 总结

Vue 3 的 Composition API 提供了一种更灵活、更强大的方式来组织组件逻辑。虽然学习曲线稍陡，但它带来的代码复用和组织能力的提升是值得的。

---

> 📅 发布时间: 2026-05-01
> 🏷️ 标签: Vue, JavaScript, 前端框架
> 📂 分类: 前端开发
