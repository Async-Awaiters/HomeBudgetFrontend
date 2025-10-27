import { defineStore } from 'pinia';
import {accountTypes} from './../helpers/accountTypes';

export const useformsDataStore = defineStore('formsData', {
  state: () => ({
    fields: {
      email: {
        fieldType: 'Text',
        id: "email",
        label: 'email',
        placeholder: "email",
        errors: [],
        rules: [
          {type: 'required', message: 'email обязателен'},
          {type: 'email', message: 'email не валидный'}
        ],
        valueId: null,
        value: ""
      },
      password: {
        id: "password",
        fieldType: 'Text',
        type: "tel",
        label: "Ваш пароль",
        placeholder: "Введите ваш пароль",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'пароль обязателен'},
        ],
        valueId: null,
        value: "",
      },
      confirmPassword: {
        id: "confirmPassword",
        fieldType: 'Text',
        type: "tel",
        label: "Ваш пароль",
        placeholder: "Повторите пароль",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'пароль обязателен'},

        ],
        valueId: null,
        value: "",
      },
      login: {
        id: "login",
        type: "text",
        fieldType: 'Text',
        label: "Имя пользователя",
        placeholder: "Имя пользователя",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'логин обязателен'},

        ],
        valueId: null,
        value: "",
      },
      firstName: {
        id: "firstName",
        type: "text",
        fieldType: 'Text',
        label: "Имя пользователя",
        placeholder: "Имя пользователя",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'имя обязательно'},

        ],
        valueId: null,
        value: "",
      },
      lastName: {
        id: "lastName",
        type: "text",
        fieldType: 'Text',
        label: "Фамилия",
        placeholder: "Фамилия",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'фамилия обязательна'},

        ],
        valueId: null,
        value: "",
      },
      birthdate: {
        id: "birthdate",
        type: "text",
        fieldType: 'Birthdate',
        label: "дата рождения",
        placeholder: "дата рождения",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'дата рождения обязательна'},

        ],
        valueId: null,
        value: "",
      },
      accountName: {
        id: "accountName",
        type: "text",
        fieldType: 'Text',
        label: "имя счёта",
        placeholder: "имя счёта",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'имя счёта обязательно'},

        ],
        valueId: null,
        value: "",
      },
      accountType: {
        id: "accountType",
        type: "text",
        fieldType: 'CustomSelect',
        label: "тип счёта",
        placeholder: "тип счёта",
        mask: "",
        onlySelect: true,
        items: accountTypes,
        errors: [],
        rules: [
          {type: 'required', message: 'поле обязательно'},

        ],
        selectHasSearch: true,
        valueId: null,
        valueEn: '',
        value: "",
      },
      newAccountName: {
        id: "newAccountName",
        type: "text",
        fieldType: 'Text',
        label: "введите новое имя счёта",
        placeholder: "новое имя счёта",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'имя счёта обязательно'},

        ],
        valueId: null,
        value: "",
      },
      newAccountType: {
        id: "newAccountType",
        type: "text",
        fieldType: 'Text',
        label: "введите новый тип счёта",
        placeholder: "новый тип счёта",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'тип счёта обязателен'},

        ],
        valueId: null,
        value: "",
      },
      transactionAmount: {
        id: "transactionAmount",
        type: "number",
        fieldType: 'Text',
        label: "сумма транзакции",
        placeholder: "введите сумму",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'сумма обязательна'},

        ],
        valueId: null,
        value: "",
      },
      transactionCategory: {
        id: "transactionCategory",
        type: "text",
        fieldType: 'CustomSelect',
        label: "категория",
        placeholder: "выберите категорию",
        mask: "",
        items: [],//массив для выбора из списка
        errors: [],
        rules: [
          {type: 'required', message: 'поле обязательно'},

        ],
        selectHasSearch: true,
        value: "",
        valueId: null,
        showButton: true
      },
      transactionCurrency: {
        id: "transactionCurrency",
        type: "text",
        fieldType: 'CustomSelect',
        label: "валюта",
        placeholder: "выберите валюту",
        mask: "",
        items: [],//массив для выбора из списка
        errors: [],
        rules: [
          {type: 'required', message: 'поле обязательно'},

        ],
        selectHasSearch: true,
        valueId: null,
        value: "",
      },
      categoriesCreateField: {
        id: "categoriesCreateField",
        type: "text",
        fieldType: 'Text',
        label: "добавить категорию",
        placeholder: "категория",
        mask: "",
        items: [],//массив для выбора из списка
        errors: [],
        rules: [
          {type: 'required', message: 'поле обязательно'},

        ],
        valueId: null,
        value: "",
      },
      categoriesEditFieldValue: {
        id: "categoriesEditFieldValue",
        type: "text",
        fieldType: 'Text',
        label: "введите текст для изменения",
        placeholder: "категория",
        mask: "",
        items: [],//массив для выбора из списка
        errors: [],
        rules: [
          {type: 'required', message: 'поле обязательно'},

        ],
        valueId: null,
        value: "",
      },
      categoriesEditFieldSelect: {
        id: "categoriesEditFieldSelect",
        type: "text",
        fieldType: 'CustomSelect',
        label: "выберите категорию для изменения",
        placeholder: "категория",
        mask: "",
        items: [],//массив для выбора из списка
        errors: [],
        rules: [
          {type: 'required', message: 'поле обязательно'},

        ],
        valueId: null,
        value: "",
      },
      categoriesDeleteField: {
        id: "categoriesDeleteField",
        type: "text",
        fieldType: 'CustomSelect',
        label: "удалить категорию",
        placeholder: "категория",
        mask: "",
        items: [],//массив для выбора из списка
        errors: [],
        rules: [
          {type: 'required', message: 'поле обязательно'},

        ],
        valueId: null,
        value: "",
      },
      accountCurrency: {
        id: "accountCurrency",
        type: "text",
        fieldType: 'CustomSelect',
        label: "валюта",
        placeholder: "выберите валюту",
        mask: "",
        items: [],//массив для выбора из списка
        errors: [],
        rules: [
          {type: 'required', message: 'поле обязательно'},

        ],
        selectHasSearch: true,
        valueId: null,
        value: "",
      },
      transactionDescription: {
        id: "transactionDescription",
        type: "text",
        fieldType: 'Text',
        label: "введите описание",
        placeholder: "описание",
        mask: "",
        items: [],//массив для выбора из списка
        errors: [],
        rules: [
          {type: 'required', message: 'поле обязательно'},

        ],
        valueId: null,
        value: "",
      },
      accountOverdraft: {
        id: "accountOverdraft",
        type: "number",
        fieldType: 'Text',
        label: "овердрафт",
        placeholder: "введите сумму",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'сумма обязательна'},

        ],
        valueId: null,
        value: "",
      },
      accountCreditLimit: {
        id: "accountCreditLimit",
        type: "number",
        fieldType: 'Text',
        label: "кредитный лимит",
        placeholder: "введите сумму",
        mask: "",
        errors: [],
        rules: [
          {type: 'required', message: 'сумма обязательна'},

        ],
        valueId: null,
        value: "",
      },
      
    },
    
    errorsNotation: {
        status: false,
        text: ""
    }
  }),
  actions: {
    // Инициализация поля (вызывается в mounted компонента)
    initField(fieldName, initialValue = '', rules = []) {
      if (!this.fields[fieldName]) {
        this.fields[fieldName] = {
          value: initialValue,
          errors: [],
          rules,
          touched: false
        };
      }
    },

    // Обновление значения
    updateField(fieldName, value) {
      console.log(12, fieldName, value, this.fields[fieldName])
      if (this.fields[fieldName]) {
        console.log('hello')
        this.fields[fieldName].value = value;
        this.validateField(fieldName);
      }
    },

    // Валидация
    validateField(fieldName) {
      const field = this.fields[fieldName];
      if (!field) return;

      field.errors = [];
      field.rules.forEach(rule => {
        if (!this.checkRule(field.value, rule)) {
          field.errors.push(rule.message);
        }
      });
    },

    // Проверка правила
    checkRule(value, rule) {
      switch (rule.type) {
        case 'required': return !!value?.trim();
        case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'minLength': return value.length >= rule.value;
        default: return true;
      }
    },

    // Пометить как "тронутое"
    markAsTouched(fieldName) {
      if (this.fields[fieldName]) {
        this.fields[fieldName].touched = true;
      }
    },
    select(value, fieldName){
      console.log('onlySelect', this.fields[fieldName], this.fields[fieldName].onlySelect)
      // this.value = value
      console.log('select value', value)
      console.log('select', this.fields[fieldName])
      if(value.id){
        this.fields[fieldName].valueId = value.id;

        if(this.fields[fieldName].id === 'accountType'){
          this.fields[fieldName].valueEn = value.nameEn;
        }
      }
      
      this.fields[fieldName].value = value.name;

    },
    selectClear(fieldName){
      this.fields[fieldName].value = ''
    }

  },
  getters: {
    // Получить состояние поля
    getField: (state) => (fieldName) => state.fields[fieldName] || null,
    getAllData: (state) => {
      return state.fields
    }
  }
})
