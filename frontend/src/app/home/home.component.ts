import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Car {
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  transmission: string;
  seats: number;
  fuel: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatarUrl: string;
}

interface Step {
  icon: string;
  title: string;
  description: string;
}

interface Usp {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isNavScrolled = signal(false);
  isMobileMenuOpen = signal(false);

  bookingForm = {
    location: '',
    pickupDate: '',
    returnDate: '',
    carType: '',
  };

  cars: Car[] = [
    {
      name: 'Genesis GV80',
      category: 'SUV',
      price: 89,
      imageUrl:
        'https://images.pexels.com/photos/31118729/pexels-photo-31118729.jpeg?auto=compress&cs=tinysrgb&w=600',
      imageAlt: 'Sleek black Genesis GV80 SUV. Photo by Hyundai Motor Group on Pexels',
      transmission: 'Automatic',
      seats: 7,
      fuel: 'Petrol',
    },
    {
      name: 'BMW i5 Sedan',
      category: 'Sedan',
      price: 65,
      imageUrl:
        'https://images.pexels.com/photos/20200900/pexels-photo-20200900.jpeg?auto=compress&cs=tinysrgb&w=600',
      imageAlt: 'Sleek blue BMW i5 sports car. Photo by Esmihel Muhammed on Pexels',
      transmission: 'Automatic',
      seats: 5,
      fuel: 'Electric',
    },
    {
      name: 'Genesis G80 Sport',
      category: 'Luxury',
      price: 120,
      imageUrl:
        'https://images.pexels.com/photos/20894618/pexels-photo-20894618.jpeg?auto=compress&cs=tinysrgb&w=600',
      imageAlt: 'Striking red luxury sedan. Photo by Hyundai Motor Group on Pexels',
      transmission: 'Automatic',
      seats: 5,
      fuel: 'Petrol',
    },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Sarah Mitchell',
      role: 'Business Traveler',
      quote:
        'Absolutely seamless experience from booking to return. The car was immaculate and pickup took less than 5 minutes. Trator has ruined every other rental company for me.',
      rating: 5,
      avatarUrl: 'https://i.pravatar.cc/80?u=sarah-mitchell',
    },
    {
      name: 'James Omondi',
      role: 'Family Trip',
      quote:
        "We needed an SUV for a road trip and Trator delivered perfectly. Well-maintained vehicle, fair pricing, and genuinely helpful staff. 10 out of 10, would rent again.",
      rating: 5,
      avatarUrl: 'https://i.pravatar.cc/80?u=james-omondi',
    },
    {
      name: 'Priya Sharma',
      role: 'Corporate Client',
      quote:
        "Our company has used Trator for executive fleet rentals for over a year. Consistent quality, transparent billing, and premium vehicles that impress our clients every time.",
      rating: 5,
      avatarUrl: 'https://i.pravatar.cc/80?u=priya-sharma',
    },
  ];

  steps: Step[] = [
    {
      icon: 'fas fa-car',
      title: 'Choose Your Car',
      description:
        'Browse our wide selection of vehicles and pick the one that suits your needs and budget.',
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Book Online',
      description:
        'Fill in your details, select pickup and drop-off dates, and confirm your booking instantly.',
    },
    {
      icon: 'fas fa-key',
      title: 'Pick Up',
      description:
        "Head to our location and collect your keys — we'll have everything ready for you.",
    },
    {
      icon: 'fas fa-road',
      title: 'Drive Away',
      description:
        "Hit the road and enjoy your journey. Return the car hassle-free when you're done.",
    },
  ];

  usps: Usp[] = [
    {
      icon: 'fas fa-tag',
      title: 'Affordable Pricing',
      description:
        'Get the best rates with no hidden fees. Transparent pricing, every time — guaranteed.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Well-Maintained Vehicles',
      description:
        'Every vehicle in our fleet undergoes rigorous inspection and regular servicing.',
    },
    {
      icon: 'fas fa-headset',
      title: '24/7 Support',
      description:
        'Our dedicated team is available around the clock to assist you wherever you are.',
    },
    {
      icon: 'fas fa-bolt',
      title: 'Easy Booking',
      description:
        'Book your car online in under 2 minutes — no paperwork, no queues, no hassle.',
    },
  ];

  constructor(private router: Router) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isNavScrolled.set(window.scrollY > 60);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.closeMobileMenu();
  }

  onBookNow(): void {
    this.router.navigate(['/auth/login']);
  }

  onBrowseCars(): void {
    this.scrollToSection('cars');
  }

  onRentNow(_car: Car): void {
    this.router.navigate(['/auth/login']);
  }

  onSearchCars(): void {
    this.router.navigate(['/vehicles']);
  }

  scrollTestimonials(direction: 'left' | 'right'): void {
    const container = document.querySelector('.testimonials-track') as HTMLElement;
    if (container) {
      const scrollAmount = container.clientWidth * 0.55;
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
