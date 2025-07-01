/**
 * Button Component - Shadcn/UI Style
 */

const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  },
};

class Button {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    const variant = this.element.dataset.variant || 'default';
    const size = this.element.dataset.size || 'default';
    
    // 基础样式
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'whitespace-nowrap',
      'rounded-md',
      'text-sm',
      'font-medium',
      'ring-offset-background',
      'transition-colors',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2',
      'disabled:pointer-events-none',
      'disabled:opacity-50'
    ];

    // 应用样式
    this.element.className = [
      ...baseClasses,
      buttonVariants.variant[variant],
      buttonVariants.size[size]
    ].join(' ');

    // 添加交互效果
    this.addInteractions();
  }

  addInteractions() {
    // 点击波纹效果
    this.element.addEventListener('click', (e) => {
      if (this.element.disabled) return;
      
      const ripple = document.createElement('span');
      const rect = this.element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      this.element.style.position = 'relative';
      this.element.style.overflow = 'hidden';
      this.element.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  }
}

// CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Auto-initialize buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-component="button"]').forEach(el => {
    new Button(el);
  });
});

// Export for manual initialization
window.Button = Button;
