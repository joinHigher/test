<template>
    <el-input
        :disabled="disabled"
        :readonly="readonly"
        :autofocus="autofocus"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :minlength="minlength"
        :type="type"
        :max="max"
        :min="min"
        :size="size"
        :name="name"
        :label="label"
        v-model="currentVal"
        ref="input"
    >
        <template slot="prepend" v-if="$slots.prepend">
            <slot name="prepend"></slot>
        </template>
        <template slot="append" v-if="$slots.append">
            <slot name="append"></slot>
        </template>
    </el-input>
</template>

<script>
    export default {
        props: {
            value: [String, Number],

            dotNum: {
                type: Number,
                default: 2
            },
            placeholder: String,
            maxlength: Number,
            minlength: Number,
            readonly: Boolean,
            autofocus: Boolean,
            disabled: Boolean,
            type: {
                type: String,
                default: 'text'
            },
            max: {
                type: Number,
                default: Infinity
            },
            min: {
                type: Number,
                default: -Infinity
            },
            size: String,
            name: String,
            label: String
        },
        computed: {
            currentVal: {
                get() {
                    return this.value
                },
                set(value) {
                    const plusNum = this.dotNum ? 1 : 0

                    let formattedValue = value.trim()
                        .slice(
                            0,
                            value.indexOf('.') === -1
                                ? value.length
                                : value.indexOf('.') + this.dotNum + plusNum
                        )

                    if (formattedValue !== value) {
                        // 这里不一致的时候会导致 vaule 的值并没有发生改变， emit的值还是之前的 ，只能通过手动修改
                        this.$nextTick(()=> {
                            this.$refs.input.setCurrentValue(formattedValue)
                        })
                    }

                    this.$emit('input', formattedValue)
                }
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
