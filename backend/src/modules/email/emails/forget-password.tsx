import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface LinearLoginCodeEmailProps {
  code: string;
}

const baseUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

const ForgetPasswordEmail = ({ code = '' }: LinearLoginCodeEmailProps) => (
  <Html>
    <Head lang="pt-br" />
    <Preview>Recuperação de senha</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/logo.png`}
          width="90"
          height="40"
          alt="Linear"
          style={logo}
        />
        <Heading style={heading}>Recuperação de senha</Heading>
        <Text style={paragraph}>
          Seu codigo de recuperação de senha (válido por 15 minutos):
        </Text>
        <code style={codeStyle}>{code}</code>
        <Hr style={hr} />
        <Text style={paragraph}>
          Caso você não tenha solicitado a recuperação de senha, ignore este
          email.
        </Text>
        <Link href="mailto:contato@zapdiviser.com" style={reportLink}>
          Em caso de dúvidas, entre em contato conosco
        </Link>
      </Container>
    </Body>
  </Html>
);

export default ForgetPasswordEmail;

const logo = {
  borderRadius: 21,
  width: 180,
  height: 60,
  background: '#16a34a',
  padding: '10px',
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const reportLink = {
  fontSize: '14px',
  color: '#b4becc',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
};

const codeStyle = {
  fontFamily: 'monospace',
  fontWeight: '700',
  padding: '1px 4px',
  backgroundColor: '#dfe1e4',
  letterSpacing: '-0.3px',
  fontSize: '21px',
  borderRadius: '4px',
  color: '#3c4149',
};
