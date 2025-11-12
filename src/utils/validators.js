export function validateEmail(v) {
  if (!v) return "이메일을 입력하세요.";
  const ok = /\S+@\S+\.\S+/.test(v);
  return ok ? "" : "올바른 이메일 형식이 아닙니다.";
}
export function validatePassword(v) {
  if (!v) return "비밀번호를 입력하세요.";
  if (v.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
  return "";
}
export function validateName(v) {
  if (!v) return "이름을 입력하세요.";
  return "";
}
