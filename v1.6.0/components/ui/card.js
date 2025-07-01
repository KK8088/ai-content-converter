/**
 * Card Component - Shadcn/UI Style
 */

class Card {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    // 基础卡片样式
    const baseClasses = [
      'rounded-lg',
      'border',
      'bg-card',
      'text-card-foreground',
      'shadow-sm'
    ];

    this.element.classList.add(...baseClasses);
    this.setupSubComponents();
  }

  setupSubComponents() {
    // Card Header
    const header = this.element.querySelector('[data-card="header"]');
    if (header) {
      header.classList.add('flex', 'flex-col', 'space-y-1.5', 'p-6');
    }

    // Card Title
    const title = this.element.querySelector('[data-card="title"]');
    if (title) {
      title.classList.add('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
    }

    // Card Description
    const description = this.element.querySelector('[data-card="description"]');
    if (description) {
      description.classList.add('text-sm', 'text-muted-foreground');
    }

    // Card Content
    const content = this.element.querySelector('[data-card="content"]');
    if (content) {
      content.classList.add('p-6', 'pt-0');
    }

    // Card Footer
    const footer = this.element.querySelector('[data-card="footer"]');
    if (footer) {
      footer.classList.add('flex', 'items-center', 'p-6', 'pt-0');
    }
  }
}

// Auto-initialize cards
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-component="card"]').forEach(el => {
    new Card(el);
  });
});

window.Card = Card;
