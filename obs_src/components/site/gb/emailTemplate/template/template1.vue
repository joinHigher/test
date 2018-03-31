<template>
    <table width="650" border="0" cellspacing="0" cellpadding="0" align="center">
        <tbody>
            <tr>
                <td :bgcolor="templateData.bg_color">
                    <!--start header-->
                    <em-header></em-header>
                    <!--end header-->

                    <!--start content-->
                    <table width="650" border="0" align="center" cellpadding="0" cellspacing="0" :bgcolor="templateData.bg_color">
                        <tbody>
                            <!--banner-->
                            <tr v-if="templateData.banner">
                                <td v-html="templateData.banner"></td>
                            </tr>
                            <tr v-for="(plate, plateIndex) in templateData.plate" :key="plate.name">
                                <td :style="{padding: `${plateIndex === 0 ? '20' : '15'}px 5px 5px`}">
                                    <em-module1 :data="plate" v-if="plate.name === 'module1'"></em-module1>
                                    <em-module2 :data="plate" v-if="plate.name === 'module2'"></em-module2>
                                    <em-module3 :data="plate" v-if="plate.name === 'module3'"></em-module3>
                                    <em-module4 :data="plate" v-if="plate.name === 'module4'"></em-module4>
                                    <em-module5 :data="plate" v-if="plate.name === 'module5'"></em-module5>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!--end content-->

                    <!--start footer-->
                    <em-footer></em-footer>
                    <!--end footer-->
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import emHeader from '../components/header.vue'
    import emFooter from '../components/footer.vue'
    import emModule1 from '../components/module1.vue'
    import emModule2 from '../components/module2.vue'
    import emModule3 from '../components/module3.vue'
    import emModule4 from '../components/module4.vue'
    import emModule5 from '../components/module5.vue'

    export default {
        name: 'template1',
        components: {
            emHeader,
            emFooter,
            emModule1,
            emModule2,
            emModule3,
            emModule4,
            emModule5
        },
        props:{
            templateData: {
                type: Object,
                default: function () {
                    return {
                        plate: []
                    }
                }
            }
        }
    }
</script>
