<template>
    <div class="birthdate_container">
        <div class="birthdate_container_outer">
            <label for="id">{{ label }}</label>
            <div class="birthdate_container_inner">
                <input
                    v-model="fieldValue"
                    :id="id"
                    :type="type"
                    :value="value"
                    @input="handleInput"
                    @blur="handleBlur"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    class="birthdate"
                    v-maska="'##.##.####'"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { vMaska } from "maska/vue"
import moment from "moment"
import { useformsDataStore } from '@/stores/formsData';

    export default {
        directives: { maska: vMaska },
        props: {
            id: { type: String, required: true },
            label: String,
            type: { type: String, default: 'text' },
            placeholder: String,
            disabled: Boolean,
            rules: { type: Array, default: () => [] },
            showErrors: { type: Boolean, default: true }
        },
        mounted() {
            const store = useformsDataStore();
            store.initField(this.id, '', this.rules);
        },
        computed: {
            value() {
                const store = useformsDataStore();
                return store.getField(this.id)?.value || '';
            },
            errors() {
                const store = useformsDataStore();
                return store.getField(this.id)?.errors || [];
            }
        },
        methods: {
            handleInput(e) {
                const store = useformsDataStore();
                store.updateField(this.id, e.target.value);
                this.$emit('update:modelValue', e.target.value);
            },
            handleBlur() {
                const store = useformsDataStore();
                store.markAsTouched(this.id);
                store.validateField(this.id);
                this.$emit('blur');
            }
        }
    }
</script>

<style lang="scss" scoped>
.birthdate {
    width: 100%;
    height: 42px;
    border-radius: 8px;
    border: 2px solid silver;
    background-color: #fff;
    outline: none;
    border: 1px solid #000;
    padding-left: 10px;
    font-size: 18px;
    margin-bottom: 20px;
    
    &_container {
        margin-bottom: 10px;
        position: relative;
        
        &_inner {
            position: relative;
            overflow: hidden;
            border-radius: 8px;

            &_button {
                background-color: #f3f3f3;
                position: absolute;
                top: 2px;
                right: 2px;
                // transform: translateY(-50%);
                width: 40px;
                height: 38px;
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;

                & > img {
                    width: 25px;
                    height: 25px;
                }
            }
        }
    }

    &_error {
        text-align: left;
        color: red;
        position: absolute;
        top: 65px;
        left: 10px;

    }
}
</style>