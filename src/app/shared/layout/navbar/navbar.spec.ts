import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';

describe('Navbar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Navbar);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a working link to the admin panel', () => {
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const adminLink = compiled.querySelector('.app-navbar__admin-link');
    expect(adminLink?.getAttribute('href')).toBe('/admin');
  });

  it('should render the placeholder links as non-interactive elements', () => {
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const placeholders = compiled.querySelectorAll('.app-navbar__link--disabled');
    expect(placeholders.length).toBe(3);
    placeholders.forEach((placeholder) => {
      expect(placeholder.tagName).toBe('SPAN');
      expect(placeholder.getAttribute('href')).toBeNull();
    });
  });
});
