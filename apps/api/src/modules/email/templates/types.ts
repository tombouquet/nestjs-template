/**
 * Template name union type
 * Add new template names here as you create new templates
 */
export type TemplateName = 'welcome' | 'password-reset';

/**
 * Props for the welcome email template
 */
export interface WelcomeEmailProps {
  name: string;
  email: string;
}

/**
 * Props for the password reset email template
 */
export interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
  expiresIn: string;
}

/**
 * Template props registry mapping template names to their prop types
 */
export type TemplateProps = {
  welcome: WelcomeEmailProps;
  'password-reset': PasswordResetEmailProps;
};
