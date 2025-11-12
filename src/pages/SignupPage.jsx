// src/pages/SignupPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TextField from "../components/TextField.jsx";
import SocialButton from "../components/SocialButton.jsx";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validators.js";
//import { getKakaoLoginUrl } from "../utils/kakaoLogin";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const nav = useNavigate();

  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    const eName = validateName(name);
    const eEmail = validateEmail(email);
    const ePw = validatePassword(password);
    const eCf = password === confirm ? "" : "비밀번호가 일치하지 않습니다.";
    const nextErr = { name: eName, email: eEmail, password: ePw, confirm: eCf };
    setErrors(nextErr);
    if (eName || eEmail || ePw || eCf) return;

    try {
      setLoading(true);
      await signup({ name, email, password }); // useAuth 적용
      nav("/login");
    } catch (err) {
      setErrors({ form: "이미 존재하는 이메일일 수 있습니다." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <FullScreen>
      <Card>
        <CardHeader>
          <h1>회원가입</h1>
          <p>필수 정보를 입력하고 계정을 만들어 보세요.</p>
        </CardHeader>

        {errors.form && <FormError>{errors.form}</FormError>}

        <form onSubmit={onSubmit} noValidate>
          <Stack>
            <TextField
              label="이름"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              autoComplete="name"
              error={errors.name}
            />
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
              placeholder="비밀번호 (8자 이상)"
              autoComplete="new-password"
              error={errors.password}
              type="password"
            />
            <TextField
              label="비밀번호 확인"
              name="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="비밀번호 확인"
              autoComplete="new-password"
              error={errors.confirm}
              type="password"
            />
            <Submit type="submit" disabled={loading}>
              {loading ? "가입 중…" : "회원가입"}
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
            Google 계정으로 계속하기
          </SocialButton>
          <SocialButton
            iconSrc="/assets/icons/ico_login_kakao.png"
            $bg="#FEE500"
            $color="#111"
            onClick={() => {
              //window.location.href = getKakaoLoginUrl();
            }}
          >
            카카오 계정으로 계속하기
          </SocialButton>
        </Stack>

        <FootNote>
          이미 계정이 있으신가요? <a href="/login">로그인</a>
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
  max-width: 480px;
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
