<template>
    <div class="installment-brazil">
        <installment-base :apiConf="apiConfig"></installment-base>
    </div>
</template>

<script>
    import installmentBase from '../../pageComponents/payment/installmentBase.vue'
    import installmentApi from '../../common/installmentApi'

    export default{
        components: {
            installmentBase
        },
        data() {
            return {
                apiConfig: installmentApi('mexico')
            }
        }
    }
</script>
