import { PasswordResetEmail } from './password-reset/password-reset-email';
import type { PasswordResetEmailProps } from './password-reset/password-reset-email';
import { WelcomeEmail } from './welcome/welcome-email';
import type { WelcomeEmailProps } from './welcome/welcome-email';
import type { TemplateName, TemplateProps } from './types';

/**
 * Template registry mapping template names to their React components
 */
export const templates = {
  welcome: WelcomeEmail,
  'password-reset': PasswordResetEmail,
} as const;

/**
 * Type-safe template component type
 */
export type TemplateComponent<T extends TemplateName> = (
  props: TemplateProps[T],
) => ReturnType<typeof WelcomeEmail>;

/**
 * Get a template component by name
 */
export function getTemplate<T extends TemplateName>(
  name: T,
): TemplateComponent<T> {
  const template = templates[name] as TemplateComponent<T> | undefined;
  if (!template) {
    throw new Error(`Template "${name}" not found`);
  }
  return template;
}

// Re-export types for convenience
export type {
  TemplateName,
  TemplateProps,
  WelcomeEmailProps,
  PasswordResetEmailProps,
};
