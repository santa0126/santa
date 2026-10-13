import type { ReactNode } from 'react';
import clsx from 'clsx';

const asset = (f: string) => `/assets/${f}`;

export function Header({ title, root, onBack }: { title: string; root?: boolean; onBack?: () => void }) {
  if (root) {
    return (
      <header className="sticky top-0 z-10 flex h-header items-center gap-12 bg-bg-surface px-16 py-4">
        <p className="flex-1 font-kr-bold text-subtitle font-bold text-text-primary">{title}</p>
        <img src={asset('c6ee3.svg')} alt="U+" width={32} height={24} />
      </header>
    );
  }
  return (
    <header className="sticky top-0 z-10 flex h-header items-center gap-8 bg-bg-surface px-16 py-4">
      <button type="button" aria-label="뒤로가기" onClick={onBack} className="flex size-icon cursor-pointer items-center justify-center">
        <img src={asset('dfb9a.svg')} alt="" width={24} height={24} />
      </button>
      <p className="flex-1 text-center font-kr-regular text-subtitle text-text-primary">{title}</p>
      <span className="size-icon" />
    </header>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'xl',
  disabled,
  onClick,
  type = 'button',
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'xl';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'flex cursor-pointer items-center justify-center rounded-8 px-24 font-kr-regular text-body whitespace-nowrap transition-colors disabled:cursor-not-allowed',
        size === 'xl' ? 'h-cta w-full py-16' : 'py-8',
        variant === 'primary'
          ? 'bg-fill-primary text-text-on-dark hover:bg-fill-primary-hover disabled:bg-fill-disabled disabled:font-kr-medium'
          : 'border border-border-default bg-surface-default text-text-primary hover:bg-bg-subtle',
      )}
    >
      {children}
    </button>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-border-subtle px-12 py-4 font-kr-bold text-caption font-bold text-text-secondary">
      {children}
    </span>
  );
}

export function FilterChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={clsx(
        'flex h-chip cursor-pointer items-center justify-center rounded-full px-16 py-8 text-body-sm whitespace-nowrap',
        selected
          ? 'bg-fill-secondary font-kr-regular text-text-on-dark'
          : 'border border-border-default bg-bg-surface font-kr-medium font-medium text-text-primary',
      )}
    >
      {label}
    </button>
  );
}

export function ListRow({ label, value, check, last }: { label: string; value: string; check?: boolean; last?: boolean }) {
  return (
    <div className={clsx('flex items-center gap-12 px-4 py-12 text-body-sm', !last && 'border-b border-border-subtle')}>
      {check && <img src={asset('006d8.svg')} alt="" width={6} height={6} />}
      <p className={clsx('flex-1 font-kr-medium font-medium', check ? 'text-text-primary' : 'text-text-secondary')}>{label}</p>
      <p className={clsx('text-right font-kr-regular', check ? 'text-text-accent' : 'text-text-primary')}>{value}</p>
    </div>
  );
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  inputMode?: 'text' | 'tel';
  maxLength?: number;
}) {
  return (
    <label className="flex flex-col gap-8">
      <span className="font-kr-medium text-body-sm font-medium text-text-secondary">{label}</span>
      <span className="flex flex-col gap-12">
        <span
          className={clsx(
            'flex h-field items-center border-b-input py-12 pl-2 transition-colors',
            error ? 'border-border-error' : 'border-border-default focus-within:border-border-focus',
            disabled && 'bg-bg-subtle',
          )}
        >
          <input
            value={value}
            disabled={disabled}
            inputMode={inputMode}
            maxLength={maxLength}
            placeholder={placeholder}
            aria-invalid={!!error}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent px-2 font-kr-regular text-body text-text-primary outline-none placeholder:text-text-placeholder disabled:text-text-on-disabled"
          />
        </span>
        {error && <span className="font-kr-medium text-caption font-medium text-text-error">{error}</span>}
      </span>
    </label>
  );
}

export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-8">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {checked ? (
        <img src={asset('d6d25.svg')} alt="" width={24} height={24} />
      ) : (
        <span className="flex size-icon items-center justify-center">
          <span className="size-20 rounded-4 border-input border-text-secondary" />
        </span>
      )}
      <span className="font-kr-medium text-body-sm font-medium text-text-primary">{children}</span>
    </label>
  );
}

export function BottomCTA({ children, amount }: { children: ReactNode; amount?: string }) {
  return (
    <div
      className={clsx(
        'sticky bottom-0 flex flex-col gap-12 border-t border-border-subtle bg-bg-surface px-16 pb-32',
        amount ? 'rounded-t-12 pt-16' : 'pt-12',
      )}
    >
      {amount && (
        <div className="flex items-center">
          <p className="flex-1 font-kr-medium text-body-sm font-medium text-text-secondary">월 납부 금액</p>
          <p className="font-kr-bold text-subtitle font-bold text-text-primary">{amount}</p>
        </div>
      )}
      {children}
    </div>
  );
}

export function DoneMark() {
  return (
    <span className="flex size-done items-center justify-center rounded-full bg-fill-primary">
      <img src={asset('ff209.svg')} alt="" width={30} height={30} />
    </span>
  );
}

/** Shared loading / empty / error block */
export function StateView({
  kind,
  title,
  desc,
  action,
}: {
  kind: 'loading' | 'empty' | 'error';
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className="flex flex-col items-center gap-12 rounded-16 bg-bg-default px-24 py-40 text-center">
      {kind === 'loading' && <span className="size-icon animate-spin rounded-full border-2 border-border-default border-t-fill-primary" />}
      <p className={clsx('font-kr-bold text-subtitle font-bold', kind === 'error' ? 'text-text-error' : 'text-text-primary')}>{title}</p>
      {desc && <p className="font-kr-medium text-body-sm font-medium text-text-secondary">{desc}</p>}
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-8 bg-bg-subtle', className)} />;
}
