# Hello VitePress


{{ 1 + 1 }}

<span v-for="i in 3">{{ i }}</span>


<script setup>
import { useData } from 'vitepress'
const { page } = useData()
</script>

<pre>{{ page }}</pre>


::: v-pre
`{{ This will be displayed as-is }}`
:::

::: tip
 这个是提示
:::
