<template>
    <div class="text_container">
        <div class="text_container_outer">
            <label for="id">{{ label }}</label>
            <div class="text_container_inner">
                <input
                    v-model="fieldValue"
                    :id="id"
                    :type="type"
                    :value="value"
                    @input="handleInput"
                    @blur="handleBlur"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    class="text"
                />
                
                <button
                    v-if="id === 'password' || id === 'confirmPassword'"
                    @click="passwordHanler" 
                    class="text_container_inner_button">
                    <img src="../assets/img/icons8-eye-50.png">
                </button>
            </div>
        </div>
        
        <!-- <p 
          v-for="(error, index) in errors"
          :key="index"
          class="text_error"
          >{{ error }}
        </p> -->
        <p 
          class="text_error"
          >{{ errors }}
        </p>
        
    </div>
</template>

<script>
import { useformsDataStore } from '@/stores/formsData';

export default {
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
    // const store = useformsDataStore();
    this.store.initField(this.id, '', this.rules);
  },
  computed: {
    store(){
      return useformsDataStore();
    },
    value() {
      // const store = useformsDataStore();
      return this.store.getField(this.id)?.value || '';
    },
    errors() {
      // const store = useformsDataStore();
      // return store.getField(this.id)?.errors || [];
      return this.store.getField(this.id)?.errors[0]
    }
  },
  methods: {
    handleInput(e) {
      // const store = useformsDataStore();
      this.store.updateField(this.id, e.target.value);
      this.$emit('update:modelValue', e.target.value);
    },
    handleBlur() {
      // const store = useformsDataStore();
      this.store.markAsTouched(this.id);
      this.store.validateField(this.id);
      this.$emit('blur');
    },
    passwordHanler(){
      this.store.fields[this.id].type === 'password' ? this.store.fields[this.id].type = 'text' : this.store.fields[this.id].type = 'password'
    }
  }
}
</script>

<style lang="scss" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
.text {
    width: 100%;
    height: 42px;
    border-radius: 8px;
    border: 1px solid #B5B8B1;
    background-color: #fff;
    outline: none;
    padding-left: 10px;
    font-size: 18px;
    // margin-bottom: 20px;
    
    &_container {
        margin-bottom: 10px;
        position: relative;
        width: 100%;

        &_outer {
          width: 100%;
          // margin-bottom: 20px;
        }
        
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

.has-errors {
  margin-bottom: 20px;
}
</style>