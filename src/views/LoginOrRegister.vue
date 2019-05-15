<template>

    <div class="ion-page">
      <ion-header>
        <ion-toolbar>
          <ion-title>TTracker - Login or register</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">

        <ion-segment v-on:ionChange="modeChanged" v-bind:value="selectedMode">

            <ion-segment-button value="login">
                <ion-label>I already have a user account</ion-label>
            </ion-segment-button>

            <ion-segment-button value="register">
                <ion-label>I don't have a user account</ion-label>
            </ion-segment-button>

        </ion-segment>

        <form v-if="selectedMode">

            <ion-item>
                <ion-label position="floating">E-Mail:</ion-label>
                <ion-input v-on:ionInput="emailChanged"></ion-input>
            </ion-item>
            <ion-item color="danger" v-if="!emailIsValid">
                <ion-icon name="close-circle"></ion-icon>{{validationErrors.email}}
            </ion-item>

            <ion-item>
                <ion-label position="floating">Password:</ion-label>
                <!-- When this input is focused and has a not-empty value... when the user
                     'edits' it (pressing any key), the password is cleared
                     Use clear-on-edit="false" if we want to avoid this -->
                <ion-input type="password" v-on:ionInput="passwordChanged" v-on:ionChange="passwordChanged"></ion-input>
            </ion-item>
            <ion-item color="danger" v-if="!passwordIsValid">
                <ion-icon name="close-circle"></ion-icon>{{validationErrors.password}}
            </ion-item>

            <div v-if="selectedMode==='register'">

                <ion-item>
                    <ion-label position="floating">Repeat password:</ion-label>
                    <!-- When this input is focused and has a not-empty value... when the user
                         'edits' it (pressing any key), the password is cleared
                         Use clear-on-edit="false" if we want to avoid this -->
                    <ion-input type="password" v-on:ionInput="repeatPasswordChanged" v-on:ionChange="repeatPasswordChanged"></ion-input>
                </ion-item>
                <ion-item color="danger" v-if="!repeatPasswordIsValid">
                    <ion-icon name="close-circle"></ion-icon>{{validationErrors.repeatPassword}}
                </ion-item>

            </div>

            <ion-button v-bind:disabled="loginOrRegisterButtonIsDisabled" v-on:click="loginOrRegisterButtonClicked" expand="block">{{buttonLabel[selectedMode]}}</ion-button>

        </form>

      </ion-content>

    </div>

</template>

<script>

import Vue from 'vue';

import SuperLogin from '@/services/SuperLogin';

export default {

    name: 'LoginOrRegister',

    data() {
        return {
            selectedMode: null,
            email: '',
            password: '',
            repeatPassword: '',
            neverValidated: true,
            validationErrors: {},
            buttonLabel: {
                login: 'Login',
                register: 'Register'
            }
        };
    },

    computed: {

        emailIsValid() {

            if (this.neverValidated) {
                return true;
            }

            const emailRegexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

            if (this.email === '') {
                Vue.set(this.validationErrors, 'email', 'You must type your E-Mail address!');
                return false;
            }

            if (!emailRegexp.test(this.email)) {
                Vue.set(this.validationErrors, 'email', 'This doesn\'t seem a valid E-Mail address!');
                return false;
            }

            if (this.validationErrors.email) {
                Vue.delete(this.validationErrors, 'email');
            }

            return true;

        },

        passwordIsValid() {

            if (this.neverValidated) {
                return true;
            }

            if (this.password === '') {
                Vue.set(this.validationErrors, 'password', 'You must type your password!');
                return false;
            }

            if (this.password.length < process.env.VUE_APP_MIN_PASSWORD_LENGTH) {

                Vue.set(
                    this.validationErrors,
                    'password',
                    `Password too short. Min length: ${process.env.VUE_APP_MIN_PASSWORD_LENGTH}`
                );

                return false;

            }

            if (this.validationErrors.password) {
                Vue.delete(this.validationErrors, 'password');
            }

            return true;

        },

        repeatPasswordIsValid() {

            if (this.neverValidated) {
                return true;
            }

            if (this.repeatPassword === '' && this.password !== '') {
                Vue.set(this.validationErrors, 'repeatPassword', 'You must type again your password!');
                return false;
            }

            if (this.password !== '' && this.repeatPassword !== this.password) {
                Vue.set(this.validationErrors, 'repeatPassword', 'Passwords don\'t match!');
                return false;
            }

            if (this.validationErrors.repeatPassword) {
                Vue.delete(this.validationErrors, 'repeatPassword');
            }

            return true;

        },

        loginOrRegisterButtonIsDisabled() {

            let disabled = !this.neverValidated && (!this.emailIsValid || !this.passwordIsValid);

            if (this.selectedMode === 'register') {
                disabled = disabled || !this.repeatPasswordIsValid;
            }

            return disabled;
        }

    },

    methods: {

        modeChanged(event) {
            this.selectedMode = event.target.value;
        },

        emailChanged(event) {
            this.email = event.target.value.trim().toLowerCase();
        },

        passwordChanged(event) {
            this.password = event.target.value;
        },

        repeatPasswordChanged(event) {
            this.repeatPassword = event.target.value;
        },

        loginOrRegisterButtonClicked() {

            this.neverValidated = false;

            let validationOk = this.emailIsValid && this.passwordIsValid;

            if (this.selectedMode === 'register') {
                validationOk = validationOk && this.repeatPasswordIsValid;
            }

            if (validationOk) {

                console.error('validation ok!');

                if (this.selectedMode === 'register') {

                    console.error('trying to register a new user');

                    SuperLogin.registerNewUser({
                        email: this.email,
                        password: this.password,
                        confirmPassword: this.password
                    }).catch(failData => {
                        if (failData && failData.response && failData.response.data && failData.response.data.validationErrors &&
                            failData.response.data.validationErrors.email &&
                            failData.response.data.validationErrors.email.indexOf("Email already in use") > -1) {
                            console.error('Email already in use!!!!!');
                        }
                    });
                }

            }

        }

    }

};

</script>
