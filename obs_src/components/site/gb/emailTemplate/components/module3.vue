<template>
    <module2 :data="data"></module2>
</template>

<script>
    // 模块2 和  3 长的一样的 orz..
    import module2 from './module2.vue'

    export default {
        components: {
            module2
        },
        props: {
            data: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        }
    }
</script>
