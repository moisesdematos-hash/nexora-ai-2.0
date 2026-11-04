import * as React from 'react';
import { cn } from '../lib/utils.js';

// ============================================================
// NEXORA Logo Component
// ============================================================

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 24, text: 'text-lg' },
  md: { icon: 32, text: 'text-2xl' },
  lg: { icon: 48, text: 'text-4xl' },
};

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const { icon, text } = sizeMap[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nexora-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#nexora-gradient)" />
        <path
          d="M12 34V14L22 28V14H26V34L16 20V34H12Z"
          fill="white"
          fillOpacity="0.95"
        />
        <path
          d="M30 14H36L30 24L36 34H30L24 24L30 14Z"
          fill="white"
          fillOpacity="0.7"
        />
      </svg>
      {showText && (
        <span
          className={cn(
            'font-bold tracking-tight bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent',
            text,
          )}
        >
          NEXORA AI
        </span>
      )}
    </div>
  );
}

// ============================================================
// Gradient Button
// ============================================================

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
}

export function GradientButton({
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
    xl: 'h-14 px-10 text-lg',
  };

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
        'bg-gradient-to-r from-violet-600 to-blue-600',
        'text-white shadow-lg shadow-violet-500/30',
        'hover:from-violet-700 hover:to-blue-700 hover:shadow-violet-500/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'transition-all duration-200',
        sizeClasses[size],
        className,
      )}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

// ============================================================
// Pricing Card
// ============================================================

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  yearlyPrice?: number;
  isYearly?: boolean;
  credits: number;
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
  onSelect?: () => void;
  ctaLabel?: string;
}

export function PricingCard({
  name,
  description,
  price,
  yearlyPrice,
  isYearly = false,
  credits,
  features,
  isPopular = false,
  isCurrent = false,
  onSelect,
  ctaLabel = 'Get started',
}: PricingCardProps) {
  const displayPrice = isYearly && yearlyPrice ? Math.floor(yearlyPrice / 12 / 100) : Math.floor(price / 100);

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl p-8 border transition-all duration-200',
        isPopular
          ? 'border-violet-500 bg-gradient-to-b from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 shadow-xl shadow-violet-500/20'
          : 'border-border bg-card hover:border-violet-300 dark:hover:border-violet-700',
      )}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-1">
          {price === 0 ? (
            <span className="text-4xl font-bold text-foreground">Free</span>
          ) : (
            <>
              <span className="text-4xl font-bold text-foreground">\${displayPrice}</span>
              <span className="text-muted-foreground mb-1">/mo</span>
            </>
          )}
        </div>
        {isYearly && yearlyPrice && price > 0 && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Billed \${Math.floor(yearlyPrice / 100)}/year — Save {Math.round((1 - yearlyPrice / (price * 12)) * 100)}%
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          <span className="font-semibold text-foreground">{credits.toLocaleString()}</span> AI credits/month
        </p>
      </div>

      <button
        onClick={onSelect}
        disabled={isCurrent}
        className={cn(
          'w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 mb-6',
          isPopular
            ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700 shadow-lg'
            : 'border border-input bg-background hover:bg-accent text-foreground',
          isCurrent && 'opacity-50 cursor-not-allowed',
        )}
      >
        {isCurrent ? 'Current plan' : ctaLabel}
      </button>

      <ul className="space-y-3 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <svg
              className="h-5 w-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================
// Feature Card
// ============================================================

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient?: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  gradient = 'from-violet-500 to-blue-500',
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card',
        'hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg hover:shadow-violet-500/10',
        'transition-all duration-300',
        className,
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          `bg-gradient-to-br ${gradient}`,
          'text-white shadow-lg',
          'group-hover:scale-110 transition-transform duration-300',
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
