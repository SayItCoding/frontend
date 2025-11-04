import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function CodePromptApp() {
  const [mission, setMission] = useState(1);
  const [inputPrompt, setInputPrompt] = useState("");
  const [output, setOutput] = useState("");

  const handleRun = () => {
    setOutput(`Generated code for: ${inputPrompt}`);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#E6F3FF] font-sans">
      {/* Top navigation */}
      <header className="flex justify-between items-center bg-[#8EC5FC] px-6 py-3 shadow-md">
        <div className="text-white font-extrabold text-2xl tracking-wide drop-shadow-md">CodePrompt</div>
        <div className="flex items-center gap-4 text-white">
          <span className="font-medium">다른 미션 보기</span>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 border-white ${mission === i + 1 ? "bg-yellow-300" : "bg-blue-400"}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 p-4 gap-4">
        {/* Left side - Learning mission and visual area */}
        <div className="w-1/2 bg-white rounded-2xl shadow-md p-4 flex flex-col">
          <div className="bg-[#FFDE7D] rounded-lg text-center py-2 font-bold text-lg mb-3">학습미션: {mission}</div>
          <div className="flex-1 bg-gradient-to-tl from-[#B5EAEA] to-[#EDF6E5] rounded-xl shadow-inner flex items-center justify-center">
            <div className="text-gray-600 italic">🌿 시각적 시뮬레이션 공간 🌿</div>
          </div>
          <div className="bg-[#FFF5BA] rounded-lg mt-3 p-3 text-sm font-medium">
            <span className="font-bold text-[#5A189A]">목표:</span> 자연어로 코드 프롬프트를 입력하고, 생성된 프로그램을 실행해보기!
          </div>
        </div>

        {/* Right side - NLP input area */}
        <div className="w-1/2 bg-white rounded-2xl shadow-md p-4 flex flex-col">
          <Card className="flex-1 bg-[#F0F4FF] border-none">
            <CardHeader>
              <div className="text-lg font-bold text-[#3C096C] mb-2">프롬프트 입력</div>
              <Textarea
                placeholder="예: '숫자 맞추기 게임을 만들어줘'"
                className="h-32 text-base rounded-lg border-2 border-[#C8B6FF] focus:border-[#B8C0FF]"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
              />
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleRun}
                className="bg-[#B8C0FF] hover:bg-[#A2A8D3] text-white font-semibold w-full mt-2 rounded-lg py-2"
              >
                ▶ 실행하기
              </Button>
              <div className="mt-4 bg-white border border-[#E0E0E0] rounded-lg p-3 text-sm text-gray-700 h-40 overflow-auto">
                {output || "여기에 생성된 코드가 표시됩니다..."}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#8EC5FC] text-center text-white py-2 text-sm font-medium">
        © 2025 CodePrompt Kids — NLP로 배우는 코딩 세상 🌈
      </footer>
    </div>
  );
}
