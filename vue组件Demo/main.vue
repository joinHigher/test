<!--调用组件的页面-->
<template>
    <div>
        <el-button type="success" size="large" @click="btnClick">button</el-button>
        <p> {{ this.countryInfo }} </p>

        <!--自定义组件-->
        <dia-temp ref="diaTemp" :title="diaTitle" :show="diaShow" :countrysOpt="countrysOpt"></dia-temp>
    </div>
</template>

<script>
    import diaTemp from './diaTemp'

    export default {
        components: {
            diaTemp
        },

        data () {
            return {
                self: this,

                diaShow: false,
                diaTitle: 'MY弹窗',
                countrysOpt: [
                    {code: 'as', name: 'asasasa'},
                    {code: 'ch', name: 'chain'},
                    {code: 'cn', name: 'china'},
                    {code: 'en', name: 'english'},
                ],
                countryInfo: '',
            };
        },
        created () {
            this.$eventHub.$on('cancel', this.cancel);
            this.$eventHub.$on('getCountry', this.commit);
        },

        beforeDestroy () {
            this.$eventHub.$off('cancel', this.cancel);
            this.$eventHub.$off('getCountry', this.commit);
        },

        methods: {
            btnClick () {
                this.diaShow = true;
            },

            commit (option) {
                this.countryInfo = '';
                option.forEach(item => {
                    let temp = item.name + ';';
                    this.countryInfo += temp;
                });
                this.diaShow = false;
            },

            cancel () {
                this.diaShow = false;
            },
        }
    }
</script>

