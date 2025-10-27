<template>
    <div class="signIn_container">
            <div class="signIn_inner">
                <div class="titles">
                    <h3 
                        @click="isRegistration = false"
                        :class="isRegistration ? '' : 'active'"
                        >войти
                    </h3>
                    <h3 
                        @click="isRegistration = true"
                        :class="isRegistration ? 'active' : ''"
                        >регистрация
                    </h3>
                </div>
                <div v-if="isRegistration" class="forms_container">
                    <div class="registration_container">
                        <Field
                            v-for="field of fields"
                            :key="field"
                            :fieldName="field"
                        />
                        <!-- <div class="check-policy">
                            <input v-model="checkPolicy" type="checkbox">
                            <p>Согласен с политикой конфиденциальности</p>
                        </div>  -->
                    </div>
                    <div class="check-policy">
                            <input v-model="checkPolicy" type="checkbox">
                            <p>Согласен с политикой конфиденциальности</p>
                        </div> 
                    
                </div>
                <div v-if="!isRegistration">
                    <Field
                        v-for="field of authFields"
                        :key="field"
                        :fieldName="field"
                    />
                
                </div>
                <!-- <button @click="submitData">asdas</button> -->
                <div class="signIn_buttons">
                    <CustomButton 
                        @click-on-button="registerAndLogin" 
                        :text="returnTextOfMode"
                        :type="'request'"
                        :disabled="isDisabledButton"
                    />
                    <CustomButton @click-on-button="closeModal" :text="'отмена'"/>
                </div>
            </div>
        </div>
</template>

<script>
import Text from '@/Fields/Text.vue';
import CustomButton from '@/parts/CustomButton.vue';
import Birthdate from '@/Fields/Birthdate.vue';
import moment from 'moment';


import Field from './Field.vue';

import { useformsDataStore } from '@/stores/formsData';
import { useUIDataStore } from '@/stores/UIData';

    export default {
        components: {
            Text,
            CustomButton,
            Birthdate,
            Field,
        },
        data(){
            return {
                isRegistration: false,
                fields: ['email', 'password', 'confirmPassword', 'login', 'firstName', 'lastName', 'birthdate'],
                authFields: ['login', 'password'],
                checkPolicy: false,
                ageOfAgree: 18,
                inputData: null,
                localValue: '',
                isDisabledButton: false
            }
        },
        computed: {
            connector() {
                return this.$root.connector;
            },
            returnTextOfMode(){
                return this.isRegistration ? "регистрация" : "войти"
            },
            fieldTypes(){
                const store = useformsDataStore()
                return store.getAllData;
            },
            uiStore(){
                return useUIDataStore();
            }
        },
        methods: {
            handleInput(data){
                console.log('data', data)
                this.inputData = data
            },
            closeModal(){
                this.$emit('closeWindow')
            },
            // handleSubmit() {
            //     let isValid = true
                
            //     // Валидация всех полей
            //     isValid = this.$refs.username.validateField() && isValid
            //     isValid = this.$refs.email.validateField() && isValid
            //     isValid = this.$refs.password.validateField() && isValid
                
            //     if (isValid) {
            //         console.log('Форма валидна, данные:', this.form)
            //         // Отправка данных...
            //     } else {
            //         console.log('Форма содержит ошибки')
            //     }
            // },
            registerAndLogin(){
                const store = useformsDataStore().getAllData;
                console.log('store', store)
                const UIData = useUIDataStore();
                if(this.isRegistration){
                    console.log('check', this.password === this.passwordCheck)
                    console.log('date', moment(store.birthdate.value, 'DD-MM-YYYY'))
                    if(store.password.value.trim() === store.confirmPassword.value.trim()){
                        if(this.checkPolicy){
                            const currentDate = moment();
                            const difference = currentDate.diff(moment(this.birthdate, 'DD.MM.YYYY'), 'years');
                            if(difference < this.ageOfAgree){
                                return
                            }else {
                                const userData = {
                                    login: store.login.value,
                                    email: store.email.value,
                                    firstName: store.firstName.value,
                                    lastName: store.lastName.value,
                                    password: store.password.value,
                                    birthdate: moment(store.birthdate.value, 'DD-MM-YYYY').format('YYYY-MM-DD')
                                }
                                
                                console.log('userData', userData)
                            this.connector.register(userData)
                                .then(()=> {
                                    console.log('registered!!!!!!')
                                    // localStorage.setItem('login', JSON.stringify(store.login.value))
                                    this.closeModal()
                                    this.uiStore.showNotification(false, 'Вы зарегистрировались', true)

                                })
                                .catch(err => {
                                    console.log(err)
                                    this.uiStore.showNotification(true, err.response.data.Error, true);
                                })
                            }
                        }else {
                            this.updateErrorInfo(true, "Подтвердите свое согласие на обработку данных!")
                        }
                        
                        
                    }else {
                        console.log('попал')
                        // this.formsData.errorsNotation.status = true;
                        // this.formsData.errorsNotation.text = "Пароли не совпадают!";

                        // console.log(this.formsData.errorsNotation)
                        // this.formsData.errorsNotation = {
                        //     status: true,
                        //     text: "Пароли не совпадают!"
                        // };
                        // store.errorsNotation = {
                        //     status: true,
                        //     text: "Пароли не совпадают!"
                        // }
                        this.updateErrorInfo(true, "Пароли не совпадают!")
                        // console.log(this.formsData.errorsNotation)
                    }
                          
                }else{
                    const userData = {
                        login: store.login.value,
                        password: store.password.value,
                    }
                    this.connector.login(userData)
                        .then(response=> {
                            console.log('logined!!!!!!', response)
                            const statusCode = response.status
                            localStorage.setItem('login', JSON.stringify(store.login.value))
                            localStorage.setItem('token', JSON.stringify(response.headers?.authorization))
                            localStorage.setItem('loginDate', JSON.stringify(moment().format('DD.MM.YYYY HH:mm:ss')))
                            localStorage.setItem('userId', JSON.stringify(response.data.user.id))
                            UIData.$state.isShowLoginButton = false
                            this.closeModal()
                            UIData.updateLogin()
                            // UIData.$state.infoNotifications.status = true
                            // UIData.$state.infoNotifications.text = 'Вы залогинены'
                            // UIData.$state.infoNotifications.isError = false
                            this.uiStore.showNotification(false, 'Вы залогинены', true)
                                
                        })
                        .catch(err => {
                            console.log(err)
                            // UIData.$state.infoNotifications.status = true
                            // UIData.$state.infoNotifications.text = 'Произошла ошибка'
                            // UIData.$state.infoNotifications.isError = true
                            this.uiStore.showNotification(true, err, true)
                        })
                }
            },

            updateErrorInfo(newStatus, newText) {
                const store = useformsDataStore()
                store.updateField('errorsNotation', newStatus, newText)
            },

            submitData() {
                const store = useFieldsStore();
                
                // Валидируем все поля
                Object.keys(store.fields).forEach(field => {
                    store.markAsTouched(field);
                    store.validateField(field);
                });

                // Проверяем есть ли ошибки
                const hasErrors = Object.values(store.fields)
                    .some(field => field.errors.length > 0);

                if (!hasErrors) {
                    console.log('Данные для отправки:', store.fields);
                    // Отправка данных...
                }
            }
   
        },
        mounted(){
            console.log('11111', this.fieldTypes)
            console.log('uistore', this.uiStore)
            // const currentDate = moment().format("DD.MM.YYYY");
            // console.log(currentDate)
            // console.log('diff', currentDate.diff(this.birthdate, "years"))
        }       
    }
</script>

<style lang="scss" scoped>
.signIn {
    &_container {
        max-width: 850px;
        width: 100%;

        // background-color: #fff;
        // backdrop-filter: blur(2px);
        // background-color: rgb(255 255 255 / 30%);
        // filter: blur(10px);
        // box-shadow: inset 0 0 0 3000px rgba(150, 150, 150, 0.192);
        padding: 20px;
        border-radius: 12px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: hsl(0, 0%, 55%);
        // box-shadow:
        // /* Нижний и правый эффект глубины */
        // inset -0.75px -0.5px rgba(255, 255, 255, 0.1),
        // /* Верхний и левый эффект глубины */
        // inset +0.75px +0.5px rgba(255, 255, 255, 0.025),
        // /* Эффект тени */
        // 3px 2px 10px rgba(0, 0, 0, 0.25),
        // /* Короткий подповерхностный эффект */
        // inset 0px 0px 10px 5px rgba(255, 255, 255, 0.025);
    }

    &_buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
    }
}

.titles {
    display: flex;
    justify-content: center;
    gap: 10px;
    
    margin-bottom: 20px;

    & > h3 {
        cursor: pointer;
    }
}
.active {
    color: #fff;
}

.check-policy {
    display: flex;
    // gap: 20px;
    text-align: left;
    align-items: center;
    width: 45%;
    gap: 20px;

    & > input {
        width: 30px;
        height: 30px;
    }
}

.registration {
    &_container {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
        // margin: 0 auto;

       & .field_container {
        width: 49%;
        @media(max-width: 600px){
            width: 100%;
        }
       }
    }
}

.forms_container {
    
}
</style>