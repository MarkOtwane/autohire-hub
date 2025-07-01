import { CommonModule } from '@angular/common'; // Required for ngFor, ngIf
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import CommonModule for directives like ngFor
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // Mock data for "Our Best Offers" section
  cars = [
    {
      name: 'TOYOTA CAR',
      price: 45.9,
      imageUrl: 'https://placehold.co/300x200/cccccc/000000?text=Car+1',
    },
    {
      name: 'TOYOTA CAR',
      price: 38.0,
      imageUrl: 'https://placehold.co/300x200/cccccc/000000?text=Car+2',
    },
    {
      name: 'TOYOTA CAR',
      price: 38.5,
      imageUrl: 'https://placehold.co/300x200/cccccc/000000?text=Car+3',
    },
    {
      name: 'TOYOTA CAR',
      price: 45.9,
      imageUrl: 'https://placehold.co/300x200/cccccc/000000?text=Car+4',
    },
    {
      name: 'TOYOTA CAR',
      price: 38.0,
      imageUrl: 'https://placehold.co/300x200/cccccc/000000?text=Car+5',
    },
    {
      name: 'TOYOTA CAR',
      price: 38.5,
      imageUrl: 'https://placehold.co/300x200/cccccc/000000?text=Car+6',
    },
  ];

  // Mock data for "What Says Customers" section
  testimonials = [
    {
      name: 'Hannery',
      quote:
        'It is a long established fact that a reader will be distracted by the readable content of a page.',
      imageUrl: 'https://placehold.co/100x100/cccccc/000000?text=Hannery',
    },
    {
      name: 'Channery',
      quote:
        'It is a long established fact that a reader will be distracted by the readable content of a page.',
      imageUrl: 'https://placehold.co/100x100/cccccc/000000?text=Channery',
    },
  ];

  // Form data for "Get In Touch" section
  contactForm = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };
  constructor(private router: Router) {}

  // Placeholder for form submission logic
  onSubmitContactForm(): void {
    console.log('Contact form submitted:', this.contactForm);
    // In a real application, you would send this data to your backend API
    alert('Message sent! (This is a placeholder action)');
    // Reset form or show success message
    this.contactForm = { name: '', email: '', phone: '', message: '' };
  }

  onBookNowClick() {
    this.router.navigate(['/auth/login']);
  }

  // Placeholder for navigation (e.g., for testimonial carousel)
  scrollTestimonials(direction: 'left' | 'right'): void {
    const container = document.querySelector('.testimonials-cards-container');
    if (container) {
      const scrollAmount = container.clientWidth / 2; // Scroll half the container width
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }
}
