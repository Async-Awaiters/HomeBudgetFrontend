<template>
    <div class="info-notation">
        <p class="info-notation_text">{{ infoText }}</p>
    </div>
</template>

<script>
    export default {
        computed: {
            formsData(){
                return this.$root.formsData;
            },
            infoText(){
                return this.formsData.errorsNotation.status ? this.formsData.errorsNotation.text : 'ку'
            }
        }
    }
</script>

<style lang="scss" scoped>
.info-notation {
    max-width: 300px;
    width: 100%;
    background-color: tomato;

    &_text {
        color: #000;
    }
}
</style>