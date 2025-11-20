import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function BirthdayChi() {
  const [showGift, setShowGift] = useState(false);

  // Nhạc nền đơn giản
  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
    return () => audio.pause();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white flex items-center justify-center p-6">
      <Card className="max-w-md w-full rounded-2xl shadow-xl border border-pink-200 bg-white">
        <CardContent className="p-6 text-center">
          {/* Ảnh Chi */}
          <img
            src="/chi.jpg"
            alt="Chi"
            className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-pink-300"
          />

          <h1 className="text-4xl font-bold text-pink-600 mb-4">
            🎉 Chúc mừng sinh nhật Chi 🎉
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Chúc Chi có một ngày sinh nhật thật tuyệt vời, luôn vui vẻ, luôn
            xinh đẹp và gặp nhiều điều may mắn. 💖 Mỗi khoảnh khắc hôm nay đều
            xứng đáng là kỷ niệm đẹp của Chi.
          </p>

          {/* Lời chúc dài */}
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6">
            <p className="text-pink-700 text-md font-medium leading-relaxed">
              "Chi luôn là một người đáng yêu và mang lại cảm giác dễ chịu cho
              mọi người xung quanh. Chúc Chi tuổi mới thật rực rỡ, làm được
              những điều mình mong muốn và luôn mỉm cười thật nhiều." 🌸
            </p>
          </div>

          {/* Nút mở quà */}
          {!showGift ? (
            <Button
              className="w-full rounded-xl py-6 text-lg font-semibold bg-pink-500 hover:bg-pink-600 text-white"
              onClick={() => setShowGift(true)}
            >
              🎁 Mở quà
            </Button>
          ) : (
            <div className="mt-4 p-4 border border-pink-300 rounded-xl bg-pink-50">
              <h2 className="text-xl font-bold text-pink-600 mb-2">🎀 Quà tặng cho Chi 🎀</h2>
              <p className="text-pink-700 leading-relaxed">
                Một lời chúc đặc biệt dành riêng cho Chi: <br />
                "Cảm ơn Chi vì sự dễ thương và tốt bụng. Hy vọng món quà nhỏ
                này khiến Chi mỉm cười. Chúc Chi luôn hạnh phúc và được yêu
                thương thật nhiều." 💗
              </p>
            </div>
          )}

          {/* Chữ ký */}
          <p className="text-gray-500 text-sm mt-6">— Gửi đến Chi với tất cả sự chân thành —</p>
        </CardContent>
      </Card>
    </div>
  );
}
