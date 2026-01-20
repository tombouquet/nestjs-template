import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
  expiresIn: string;
}

export const PasswordResetEmail = ({
  name,
  resetLink,
  expiresIn,
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Password Reset Request 🔐</Heading>
          </Section>

          <Section style={content}>
            <Text style={text}>Hello {name},</Text>

            <Text style={text}>
              We received a request to reset your password. Click the button
              below to create a new password:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetLink}>
                Reset Password
              </Button>
            </Section>

            <Text style={text}>
              This link will expire in <strong>{expiresIn}</strong>. If you
              didn't request a password reset, you can safely ignore this email.
            </Text>

            <Section style={linkBox}>
              <Text style={linkLabel}>
                If the button doesn't work, copy and paste this link into your
                browser:
              </Text>
              <Text style={linkText}>{resetLink}</Text>
            </Section>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              For security reasons, this link expires in {expiresIn}. If you
              didn't request this, please ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

PasswordResetEmail.PreviewProps = {
  name: 'John Doe',
  resetLink: 'https://example.com/reset-password?token=abc123',
  expiresIn: '1 hour',
} as PasswordResetEmailProps;

export default PasswordResetEmail;

// Tailwind-inspired color palette (consistent with welcome email)
const colors = {
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  white: '#ffffff',
} as const;

const main = {
  backgroundColor: colors.gray50,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: colors.white,
  margin: '0 auto',
  borderRadius: '8px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
  overflow: 'hidden',
};

const header = {
  backgroundColor: colors.blue600,
  padding: '32px 40px',
  textAlign: 'center' as const,
};

const h1 = {
  color: colors.white,
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.4',
  margin: '0',
  padding: '0',
};

const content = {
  padding: '40px 40px 32px',
};

const text = {
  color: colors.gray800,
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
  textAlign: 'left' as const,
};

const buttonContainer = {
  padding: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: colors.blue600,
  borderRadius: '6px',
  color: colors.white,
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  lineHeight: '1.5',
  transition: 'background-color 0.2s',
};

const linkBox = {
  backgroundColor: colors.gray100,
  borderRadius: '6px',
  padding: '20px',
  margin: '24px 0',
  border: `1px solid ${colors.gray200}`,
};

const linkLabel = {
  color: colors.gray700,
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 12px',
  textAlign: 'left' as const,
};

const linkText = {
  color: colors.blue600,
  fontSize: '14px',
  fontFamily: 'monospace',
  lineHeight: '1.5',
  margin: '0',
  textAlign: 'left' as const,
  wordBreak: 'break-all' as const,
  textDecoration: 'underline',
};

const divider = {
  borderColor: colors.gray200,
  margin: '0',
};

const footer = {
  padding: '24px 40px',
  backgroundColor: colors.gray50,
};

const footerText = {
  color: colors.gray600,
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
  textAlign: 'center' as const,
};
