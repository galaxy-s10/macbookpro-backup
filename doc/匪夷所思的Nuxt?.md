# 环境

nuxt版本：2.5.18

# layout里面写的注释问题

这样写没问题

```vue
<template>
  <div>
    <!-- <div>1</div> -->
    <Nuxt />
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>

```

但是在在注释前随便添加一个东西

```vue
<template>
  <div>
    1
    <!-- <div>1</div> -->
    <Nuxt />
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>

```

结果竟然会报警告：The client-side rendered virtual DOM tree is not matching server-rendered content. This is likely caused by incorrect HTML markup, for example nesting block-level elements inside <p>, or missing <tbody>. Bailing hydration and performing full client-side render.非常的奇怪。

