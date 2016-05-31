/* global describe, it, expect */

import Vue from 'vue'
import App from '../app/app.vue'

require('meteor-stubs');
MeteorStubs.install();

global.Photos = new Meteor.Collection("photos");
global.Accounts = new Meteor.Collection("accounts");

describe('App component', function() {

  const vm = new Vue({
    template: '<div><app v-ref:component></app></div>',
    components: { App }
  }).$mount()

  const component = vm.$refs.component;

  describe('Before login', function() {

    it('should be a fluid container', function() {
      expect(vm.$el.querySelectorAll('div.photo-app.container-fluid').length).toBe(1);
    })

    it('should render header', function() {
      expect(vm.$el.querySelector('.header')).toBeTruthy()
      expect(vm.$el.querySelectorAll('.header').length).toBe(1)
      expect(vm.$el.querySelector('h1').textContent).toBe('Welcome guest!')
    })

    it('should have a created hook', function() {
      expect(typeof App.created).toBe('function')
    })

    it('should have correct default state', function() {

      expect(typeof App.data).toBe('function')

      var initState = App.data()

      expect(initState).toEqual({
        userId: null,
        user: {},
        showUpload: false,
        showLogin: false,
        showRegister: false
      })

    })

    it('showLoginForm() should show login form and hide registration form', function(done) {

      component.showLoginForm();

      component.$nextTick(function() {
        expect(vm.$el.querySelectorAll('form.login-form').length).toBe(1);
        expect(vm.$el.querySelectorAll('form.registration-form').length).toBe(0);
        done();
      })
    })

    it('showRegisterForm() should show registration form and hide login form', function(done) {

      component.showRegisterForm();

      component.$nextTick(function() {
        expect(vm.$el.querySelectorAll('form.registration-form').length).toBe(1);
        expect(vm.$el.querySelectorAll('form.login-form').length).toBe(0);
        done();
      })

    })
  })

  describe('After login', function() {
    
    it('should display correct fullname', function(done) {

      component.userId = 1;
      component.user = {
        fullname: 'mock fullname'
      };

      component.$nextTick(function() {
        expect(vm.$el.querySelector('h1').textContent).toBe('Hello "mock fullname"!')
        done();
      })

    })
  })
})
