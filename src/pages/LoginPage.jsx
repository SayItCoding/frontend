// src/pages/LoginPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TextField from "../components/TextField.jsx";
import SocialButton from "../components/SocialButton.jsx";
import { validateEmail, validatePassword } from "../utils/validators.js";
//import { getKakaoLoginUrl } from "../utils/kakaoLogin";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const nav = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const e1 = validateEmail(email);
    const e2 = validatePassword(password);
    const nextErr = { email: e1, password: e2 };
    setErrors(nextErr);
    if (e1 || e2) return;

    try {
      setLoading(true);
      await login({ email, password }); // useAuth 적용
      nav("/"); // 로그인 성공
    } catch (err) {
      setErrors({ form: "이메일 또는 비밀번호를 다시 확인하세요." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <FullScreen>
      <Card>
        <CardHeader>
          <h1>로그인</h1>
          <p>계정 정보를 입력하거나 소셜 로그인을 사용하세요.</p>
        </CardHeader>

        {errors.form && <FormError>{errors.form}</FormError>}

        <form onSubmit={onSubmit} noValidate>
          <Stack>
            <TextField
              label="이메일"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email}
              type="email"
            />
            <TextField
              label="비밀번호"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
              error={errors.password}
              type="password"
            />
            <Submit type="submit" disabled={loading}>
              {loading ? "로그인 중…" : "로그인"}
            </Submit>
          </Stack>
        </form>

        <Divider>
          <span>또는</span>
        </Divider>

        <Stack>
          <SocialButton
            iconSrc="/assets/icons/ico_login_google.png"
            $bg="#fff"
            $color="#111"
            $border
            //onClick={() => alert("구글 로그인 URL 연결")}
          >
            Google로 계속하기
          </SocialButton>
          <SocialButton
            iconSrc="/assets/icons/ico_login_kakao.png"
            $bg="#FEE500"
            $color="#111"
            onClick={() => {
              //window.location.href = getKakaoLoginUrl();
            }}
          >
            카카오로 계속하기
          </SocialButton>
        </Stack>

        <FootNote>
          계정이 없으신가요? <a href="/signup">회원가입</a>
        </FootNote>
      </Card>
    </FullScreen>
  );
}

/* ---------------- Styled Components ---------------- */
const FullScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f9fafb;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06);
`;

const CardHeader = styled.header`
  margin-bottom: 18px;
  h1 {
    margin: 0 0 6px;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
  }
`;

const Stack = styled.div`
  display: grid;
  gap: 12px;
`;

const Submit = styled.button`
  height: 48px;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  border: none;
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #94a3b8;
  font-size: 12px;
  margin: 16px 0;
  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
`;

const FootNote = styled.p`
  margin-top: 12px;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  a {
    color: #2563eb;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

const FormError = styled.div`
  margin-bottom: 8px;
  color: #b00020;
  font-size: 13px;
`;
