import { provideToastr } from 'ngx-toastr';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { LoginEffect } from './login.effects';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProfileService } from '../../../core/services/user-profile/profile.service';
import { Router } from '@angular/router';
import { signIn } from '../actions/login.actions';
import { VerifiedUser } from '../../../types';
import { cold, hot } from 'jasmine-marbles';
import { Actions } from '@ngrx/effects';
import { getCartItems } from '../../cart/cart.actions';


fdescribe('LoginEffect', () => {
  let actions$: Observable<any>;
  let effect: LoginEffect;
  let authService: jasmine.SpyObj<AuthService>;
  let profileService: jasmine.SpyObj<ProfileService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'setToken']);
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', ['setUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        LoginEffect,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideToastr()
      ],
    });

    effect = TestBed.inject(LoginEffect);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    profileService = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    actions$ = TestBed.inject(Actions)
  });

  // it('should login successfully and redirect to admin dashboard for admin user', () => {
  //   const formData = { 
  //       email: 'admin@gmail.com',
  //       password: 'Pa$$w0rd!',
  //       type: '[SignIn] User SignIn'
  //    };
  //   const response: VerifiedUser = {
  //       email: 'admin@gmail.com',
  //               firstName: 'Ezio',
  //               lastName: 'Auditore Da Firenze',
  //               role: 'ADMIN',
  //               token: '39049909320'
  //   };
  //   authService.login.and.returnValue(of(response));
  //   profileService.setUser.and.stub();

  //   actions$ = of(signIn(formData));
  //   effect.login$.subscribe(() => {
  //     expect(authService.login).toHaveBeenCalledWith(formData);
  //     expect(authService.setToken).toHaveBeenCalledWith(response.token);
  //     expect(profileService.setUser).toHaveBeenCalledWith({ firstName: response.firstName, lastName: response.lastName });
  //     expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/dashboard', { replaceUrl: true });
  //   });
  // });
  it('should login successfully and redirect to admin dashboard for admin user', () => {
    const formData = { 
        email: 'admin@gmail.com',
        password: 'Pa$$w0rd!',
        type: '[SignIn] User SignIn'
     };
    const response: VerifiedUser = {
        email: 'admin@gmail.com',
                firstName: 'Ezio',
                lastName: 'Auditore Da Firenze',
                role: 'ADMIN',
                token: '39049909320'
    };
    const action = signIn(formData)
    const outcome = getCartItems()
    
    actions$ = hot('-a', { a: action })
    const resp = cold('-b|', { b: response })
    const expected = cold('--c', { c: outcome })
    profileService.setUser.and.stub();
    authService.login.and.returnValue(resp)

    expect(effect.login$).toBeObservable(expected)
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/dashboard', { replaceUrl: true });
  });

  it('should login successfully and redirect to settings for non-admin user', () => {
    const formData = { 
        email: 'tarejop778@fashlend.com',
        password: 'Pa$$w0rd!'
     };
    const response: VerifiedUser = { 
        email: 'tarejop778@fashlend.com',
        firstName: 'Harbor',
        lastName: 'Raja',
        role: 'USER',
        token: '24223234'
     };
     const action = signIn(formData)
     const outcome = getCartItems()

     actions$ = hot('-a', { a: action })
     const resp = cold('-b|', { b: response })
     const expected = cold('--c', { c: outcome })
    authService.login.and.returnValue(resp);
    profileService.setUser.and.stub();

    expect(effect.login$).toBeObservable(expected)
    expect(router.navigateByUrl).toHaveBeenCalledWith('/settings', { replaceUrl: true });

  });

  it('should handle login error', () => {
    const formData = { 
      email: 'tarejop778@fashlend.com',
      password: 'Pa$$w!'
    };
    const error = new Error('Login error');
    const action = signIn(formData);
  
    actions$ = hot('-a', { a: action });
    const response = cold('-#|', {}, error);
    const expected = cold('')
  
    authService.login.and.returnValue(response);    
    expect(effect.login$).toBeObservable(expected);
  });
})