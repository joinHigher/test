<template>
    <div class="category-tree">
        <el-tree
            :data="regions"
            :props="props"
            :load="loadNode"
            ref="categoryTree"
            lazy
            show-checkbox
            @check-change="handleCheckChange">
        </el-tree>
        <div class="act-tool">
            <el-button size="small" type="primary" icon="plus" @click="onSelect">确定添加</el-button>
        </div>
    </div>
</template>

<script>
    // 暂时不用这么复杂
    export default {
        name: 'categoryTree',
        data() {
            return {
                regions: [{
                    'name': 'region1'
                }, {
                    'name': 'region2'
                }, {
                    'name': 'region3'
                }, {
                    'name': 'region4'
                }, {
                    'name': 'region5'
                }, {
                    'name': 'region6'
                }, {
                    'name': 'region7'
                }, {
                    'name': 'region8'
                }],
                props: {
                    label: 'name',
                    children: 'zones'
                },
                count: 1
            }
        },
        methods: {
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate)
            },
            handleNodeClick(data) {
                console.log(data)
            },
            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve(
                        [...this.regions]
                    )
                }
                if (node.level > 3) return resolve([])

                var hasChild;
                if (node.data.name === 'region1') {
                    hasChild = true
                } else if (node.data.name === 'region2') {
                    hasChild = false
                } else {
                    hasChild = Math.random() > 0.5
                }

                setTimeout(() => {
                    var data;
                    if (hasChild) {
                        data = [{
                            name: 'zone' + this.count++
                        }, {
                            name: 'zone' + this.count++
                        }]
                    } else {
                        data = []
                    }

                    resolve(data)
                }, 500)
            },
            onSelect() {
                console.log(this.$refs.categoryTree.getCheckedNodes(true))
            }
        }
    }
</script>

<style lang="less" scoped>
    .category-tree{
        max-height: 500px;
        overflow: auto;
        .act-tool{
            display: flex;
            padding: 20px 0;
            justify-content: flex-end;
        }
    }
</style>
