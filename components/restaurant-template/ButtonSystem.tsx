'use client';

import React from 'react';
import Link from 'next/link';
import { BiRightArrowAlt, BiCalendarEvent, BiPlus, BiCheck } from 'react-icons/bi';

export interface ButtonBaseProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  ariaLabel?: string;
}

// 1. Primary CTA Button with Shine Hover & Arrow Motion
export interface PrimaryCtaButtonProps extends ButtonBaseProps {
  arrow?: boolean;
  shine?: boolean;
  icon?: React.ReactNode;
}

export const PrimaryCtaButton: React.FC<PrimaryCtaButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  style,
  disabled = false,
  type = 'button',
  arrow = true,
  shine = true,
  icon,
  title,
}) => {
  const content = (
    <>
      {shine && <span className="btn-shine-bar" aria-hidden="true" />}
      {icon && <span className="btn-custom-icon">{icon}</span>}
      <span>{children}</span>
      {arrow && <BiRightArrowAlt size={18} className="btn-arrow" />}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={`btn-primary-cta ${className}`} style={style} title={title}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary-cta ${className}`}
      style={style}
      title={title}
    >
      {content}
    </button>
  );
};

// 2. Book Table Button with Red Gradient, Calendar & Arrow
export interface BookTableButtonProps extends ButtonBaseProps {
  showIcons?: boolean;
}

export const BookTableButton: React.FC<BookTableButtonProps> = ({
  children = 'Book a Table',
  onClick,
  href,
  className = '',
  style,
  disabled = false,
  type = 'button',
  showIcons = true,
  title,
}) => {
  const content = (
    <>
      {showIcons && <BiCalendarEvent size={18} />}
      <span>{children}</span>
      {showIcons && <BiRightArrowAlt size={18} className="btn-arrow" />}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={`btn-book-table ${className}`} style={style} title={title}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-book-table ${className}`}
      style={style}
      title={title}
    >
      {content}
    </button>
  );
};

// 3. Outline Button (Luxury Red Outline)
export interface OutlineButtonProps extends ButtonBaseProps {
  icon?: React.ReactNode;
  arrow?: boolean;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  style,
  disabled = false,
  type = 'button',
  icon,
  arrow = false,
  title,
}) => {
  const content = (
    <>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
      {arrow && <BiRightArrowAlt size={18} className="btn-arrow" />}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={`btn-outline-luxury ${className}`} style={style} title={title}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-outline-luxury ${className}`}
      style={style}
      title={title}
    >
      {content}
    </button>
  );
};

// 4. Soft Button (Light Pink/Red Background)
export interface SoftButtonProps extends ButtonBaseProps {
  icon?: React.ReactNode;
}

export const SoftButton: React.FC<SoftButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  style,
  disabled = false,
  type = 'button',
  icon,
  title,
}) => {
  const content = (
    <>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={`btn-soft-luxury ${className}`} style={style} title={title}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-soft-luxury ${className}`}
      style={style}
      title={title}
    >
      {content}
    </button>
  );
};

// 5. Ghost Button (No Border, Dark Text -> Red on Hover with Arrow Move)
export interface GhostButtonProps extends ButtonBaseProps {
  arrow?: boolean;
}

export const GhostButton: React.FC<GhostButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  style,
  disabled = false,
  type = 'button',
  arrow = true,
  title,
}) => {
  const content = (
    <>
      <span>{children}</span>
      {arrow && <BiRightArrowAlt size={16} className="btn-arrow" />}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={`btn-ghost-luxury ${className}`} style={style} title={title}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-ghost-luxury ${className}`}
      style={style}
      title={title}
    >
      {content}
    </button>
  );
};

// 6. Circular Menu Add Button (Food Cards)
export interface MenuAddButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  isAdded?: boolean;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  ariaLabel?: string;
}

export const MenuAddButton: React.FC<MenuAddButtonProps> = ({
  onClick,
  isAdded = false,
  className = '',
  style,
  title = 'Add to Cart',
  ariaLabel = 'Add item',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-menu-add ${className}`}
      style={{
        ...style,
        backgroundColor: isAdded ? '#16845B' : undefined,
      }}
      title={isAdded ? 'Added to order' : title}
      aria-label={ariaLabel}
    >
      {isAdded ? <BiCheck size={20} /> : <BiPlus size={20} />}
    </button>
  );
};

// 7. Icon Button (Square/Circular for Search, Heart, Share, Cart)
export interface IconButtonProps extends ButtonBaseProps {
  icon: React.ReactNode;
  active?: boolean;
  activeColor?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  className = '',
  style,
  disabled = false,
  type = 'button',
  title,
  ariaLabel,
  active = false,
  activeColor = '#E63946',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-icon-luxury ${className}`}
      style={{
        ...style,
        color: active ? activeColor : undefined,
        borderColor: active ? activeColor : undefined,
        backgroundColor: active ? '#FFE5E7' : undefined,
      }}
      title={title}
      aria-label={ariaLabel || title}
    >
      {icon}
    </button>
  );
};

// 8. Interactive Loading Button (With Spinner and Success Check)
export interface InteractiveLoadingButtonProps extends ButtonBaseProps {
  isLoading: boolean;
  isSuccess?: boolean;
  defaultText: string;
  loadingText?: string;
  successText?: string;
}

export const InteractiveLoadingButton: React.FC<InteractiveLoadingButtonProps> = ({
  isLoading,
  isSuccess = false,
  defaultText,
  loadingText = 'Processing...',
  successText = '✓ Table Reserved',
  onClick,
  className = '',
  style,
  type = 'submit',
  disabled = false,
}) => {
  if (isSuccess) {
    return (
      <button
        type="button"
        disabled
        className={`btn-success-luxury w-100 ${className}`}
        style={style}
      >
        <BiCheck size={20} />
        <span>{successText}</span>
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`btn-book-table w-100 ${className}`}
      style={{
        ...style,
        opacity: isLoading ? 0.85 : 1,
        pointerEvents: isLoading ? 'none' : 'auto',
      }}
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          <BiCalendarEvent size={18} />
          <span>{defaultText}</span>
          <BiRightArrowAlt size={18} className="btn-arrow" />
        </>
      )}
    </button>
  );
};
