import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export interface WelcomeEmailProps {
  name: string;
  email: string;
}

export const WelcomeEmail = ({ name, email }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Welcome, {name}! 👋</Heading>
          </Section>

          <Section style={content}>
            <Text style={text}>
              Thank you for signing up! We're thrilled to have you join our
              community.
            </Text>

            <Text style={text}>
              Your account has been successfully created with the email address:
            </Text>

            <Section style={emailBox}>
              <Text style={emailText}>{email}</Text>
            </Section>

            <Text style={text}>
              You're all set to get started. If you have any questions or need
              assistance, our support team is here to help.
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              If you didn't create this account, please ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

WelcomeEmail.PreviewProps = {
  name: 'John Doe',
  email: 'john@example.com',
} as WelcomeEmailProps;

export default WelcomeEmail;

// Tailwind-inspired color palette
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

const emailBox = {
  backgroundColor: colors.gray100,
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 0',
  border: `1px solid ${colors.gray200}`,
};

const emailText = {
  color: colors.gray900,
  fontSize: '16px',
  fontWeight: '600',
  fontFamily: 'monospace',
  margin: '0',
  textAlign: 'center' as const,
  wordBreak: 'break-all' as const,
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
