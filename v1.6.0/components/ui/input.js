/**
 * Input Component - Shadcn/UI Style
 */

class Input {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    const baseClasses = [
      'flex',
      'h-10',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2',
      'text-sm',
      'ring-offset-background',
      'file:border-0',
      'file:bg-transparent',
      'file:text-sm',
      'file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    ];

    this.element.classList.add(...baseClasses);
    this.addEnhancements();
  }

  addEnhancements() {
    // 添加聚焦效果
    this.element.addEventListener('focus', () => {
      this.element.parentElement?.classList.add('ring-2', 'ring-ring', 'ring-offset-2');
    });

    this.element.addEventListener('blur', () => {
      this.element.parentElement?.classList.remove('ring-2', 'ring-ring', 'ring-offset-2');
    });
  }
}

class Textarea {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    const baseClasses = [
      'flex',
      'min-h-[80px]',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2',
      'text-sm',
      'ring-offset-background',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    ];

    this.element.classList.add(...baseClasses);
    this.setupAutoResize();
  }

  setupAutoResize() {
    if (this.element.dataset.autoResize === 'true') {
      this.element.addEventListener('input', () => {
        this.element.style.height = 'auto';
        this.element.style.height = this.element.scrollHeight + 'px';
      });
    }
  }
}

// Auto-initialize inputs
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[data-component="input"]').forEach(el => {
    new Input(el);
  });
  
  document.querySelectorAll('textarea[data-component="textarea"]').forEach(el => {
    new Textarea(el);
  });
});

window.Input = Input;
window.Textarea = Textarea;
