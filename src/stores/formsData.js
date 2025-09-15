import { defineStore } from 'pinia'

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
        value: "",
      },
      accountType: {
        id: "accountType",
        type: "text",
        fieldType: 'CustomSelect',
        label: "тип счёта",
        placeholder: "тип счёта",
        mask: "",
        items: [],
        errors: [],
        rules: [
          {type: 'required', message: 'поле обязательно'},

        ],
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
        value: "",
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
        value: "",
      },
    }
    
    // errorsNotation: {
    //     status: false,
    //     text: ""
    // }
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
      console.log(4, fieldName, value)
      // this.value = value
      console.log('select', this.fields[fieldName])
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
