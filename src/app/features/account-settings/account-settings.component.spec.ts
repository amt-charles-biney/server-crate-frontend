import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountSettingsComponent } from './account-settings.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

fdescribe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSettingsComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch tabs', () => {
    const { debugElement } = fixture;
    const tabs = debugElement.queryAll(By.css('[data-testid="settings-tab"]'))
    const passwordTabElement = tabs[1].nativeElement    
    component.onActiveChange(true, { label: passwordTabElement.textContent, link: passwordTabElement.href})
    fixture.detectChanges()
    expect(component.activeLink.label).toBe(passwordTabElement.textContent)
  })
});
