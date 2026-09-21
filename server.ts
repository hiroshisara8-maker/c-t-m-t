import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to initialize Gemini safely
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Cắt đi nỗi sầu" });
  });

  // API Lời An Ủi & Phân Tích Cảm Xúc (Chức năng 2 & 7)
  app.post("/api/comfort", async (req, res) => {
    try {
      const { text, mood, category } = req.body;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "Vui lòng chia sẻ đôi lời tâm sự nhé." });
      }

      const client = getGeminiClient();

      if (client) {
        const prompt = `Bạn là người bạn thân dịu dàng và ấm áp nhất trong ứng dụng chữa lành "Cắt đi nỗi sầu" dành cho học sinh, sinh viên Việt Nam.
Người dùng vừa trải lòng tâm sự như sau:
- Tâm trạng: ${mood || "Đang buồn và nặng trĩu"}
- Chủ đề: ${category || "Áp lực cuộc sống / học tập"}
- Lời tâm sự: "${text}"

Hãy đóng vai một người bạn luôn lắng nghe không phán xét, ôm lấy cảm xúc của họ bằng tất cả sự thấu cảm:
1. Đưa ra một lời nhắn an ủi sâu sắc, nhẹ nhàng, truyền cảm hứng và an ủi (từ 100 đến 180 từ), xoa dịu nỗi buồn, công nhận sự nỗ lực của bạn ấy. Xưng hô là "Mình" và "Bạn" hoặc xưng hô ngọt ngào, gần gũi.
2. Đề xuất một câu châm ngôn hoặc thông điệp nhỏ tích cực (quote) gửi tặng bạn ấy.
3. Đề xuất 2 đến 3 trò chơi / hoạt động phù hợp nhất trong ứng dụng:
   - "squishy" (Bóp squishy mochi đàn hồi - giải tỏa bồn chồn, nắn bóp mềm dẻo êm ái)
   - "bubble_pop" (Nổ bong bóng xả bực bội / tức giận)
   - "zen_plant" (Chăm sóc mầm cây tích cực - hợp với cô đơn, buồn, cần nuôi dưỡng lại hy vọng)
   - "shred_paper" (Xé vụn giấy xả giận - hợp với ấm ức, phẫn nộ, bực dọc)
   - "mindful_breathing" (Thở êm dịu 4-7-8 - hợp với hoảng loạn, lo âu, tim đập nhanh, căng thẳng thi cử)
   - "doodle" (Vẽ tự do & tô màu pastel - hợp với quá tải, bối rối, muốn giải tỏa sáng tạo)
   - "matching_game" (Ghép tranh an yên - hợp với đầu óc cần thư giãn, chuyển đổi chú ý)
4. Đưa ra 2 lời khuyên hành động nhỏ thực tế trong đời thực (ví dụ: uống 1 ly nước ấm, rời bàn học vươn vai 3 phút, đắp chăn ấm nghe một bài nhạc lofi...).

Định dạng trả về duy nhất là JSON theo cấu trúc:
{
  "comfortMessage": "Nội dung lời an ủi chân thành, ấm áp...",
  "healingQuote": "Một câu truyền cảm hứng ngắn gọn, chữa lành...",
  "recommendedGames": ["squishy", "bubble_pop"],
  "reasonForGames": "Lý do ngắn vì sao trò chơi này giúp bạn nhẹ lòng hơn lúc này",
  "realLifeTips": ["Uống một ngụm nước ấm nhỏ", "Nhắm mắt hít thở sâu 1 phút"]
}`;

        try {
          const response = await client.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.85,
            },
          });

          const rawText = response.text?.trim() || "";
          const parsed = JSON.parse(rawText);
          return res.json({
            success: true,
            data: parsed,
            source: "ai",
          });
        } catch (aiErr) {
          console.error("Gemini call error:", aiErr);
          // Fall through to fallback response
        }
      }

      // Fallback empathetic responses when Gemini API is unavailable or limits reached
      const fallback = generateEmpatheticFallback(text, mood, category);
      return res.json({
        success: true,
        data: fallback,
        source: "curated",
      });
    } catch (err: any) {
      console.error("Server comfort error:", err);
      res.status(500).json({ error: "Có lỗi khi gửi lời an ủi, bạn hãy thử lại nhé." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server "Cắt đi nỗi sầu" running on http://0.0.0.0:${PORT}`);
  });
}

function generateEmpatheticFallback(text: string, mood?: string, category?: string) {
  const lower = (text + " " + (mood || "") + " " + (category || "")).toLowerCase();

  let recommendedGames = ["squishy", "bubble_pop"];
  let comfortMessage = "Mình đã đọc hết những dòng bạn viết rồi. Cảm ơn bạn vì đã dũng cảm trút bỏ gánh nặng này vào cuốn sổ. Bạn đã rất cố gắng trong suốt thời gian qua rồi, đừng quá khắt khe với bản thân nữa nhé.";
  let healingQuote = "Bạn không cần phải hoàn hảo để xứng đáng được yêu thương và hạnh phúc.";
  let reasonForGames = "Giúp bạn nắn bóp xả căng cơ và giải tỏa những cảm xúc đè nén.";
  let realLifeTips = [
    "Uống chậm một ngụm nước ấm để làm dịu cơ thể",
    "Thả lỏng hai vai và tự ôm lấy chính mình một cái thật chặt",
  ];

  if (lower.includes("thi") || lower.includes("điểm") || lower.includes("học") || lower.includes("deadline") || lower.includes("áp lực")) {
    comfortMessage = "Học tập và thi cử đôi lúc thật sự nặng nề như một tảng đá đè lên ngực. Nhưng hãy nhớ rằng: điểm số hay một bài kiểm tra không bao giờ định nghĩa được giá trị tuyệt vời của con người bạn. Hôm nay bạn mệt rồi, hãy cho phép mình được nghỉ ngơi một chút trước khi bước tiếp nhé!";
    healingQuote = "Một bông hoa không nở vội vàng, và bạn cũng có thời gian của riêng mình.";
    recommendedGames = ["squishy", "zen_plant", "mindful_breathing"];
    reasonForGames = "Trò chơi giúp đầu óc bạn tạm rời xa bài vở, nắn bóp squishy giải tỏa và tưới tắm lại mầm năng lượng tích cực.";
    realLifeTips = ["Rời khỏi bàn học, nhìn ra cửa sổ màu xanh lá 2 phút", "Rửa mặt nhẹ nhàng bằng làn nước mát"];
  } else if (lower.includes("giận") || lower.includes("tức") || lower.includes("ức") || lower.includes("bực") || lower.includes("ghét")) {
    comfortMessage = "Cảm xúc tức giận và uất ức là hoàn toàn bình thường khi bạn gặp phải điều bất công hay tổn thương. Bạn có quyền được bực bội, và việc bạn viết ra đây thay vì giữ trong lòng là một điều vô cùng đúng đắn. Hãy để những bực dọc này tan biến dần cùng những cú chạm nhé.";
    healingQuote = "Giữ cơn giận cũng như nắm than hồng chờ ném người khác, người bị bỏng trước là chính mình. Hãy buông tay để tự do.";
    recommendedGames = ["shred_paper", "bubble_pop", "squishy"];
    reasonForGames = "Xé vụn giấy và bóp nổ bóng xua tan cơn giận, giúp cơ thể giải phóng hormone căng thẳng ngay tức thì.";
    realLifeTips = ["Bóp nhẹ nắm tay rồi thở dài ra một hơi thật mạnh", "Uống một ngụm nước lạnh để hạ hỏa"];
  } else if (lower.includes("lo âu") || lower.includes("anxious") || lower.includes("bồn chồn") || lower.includes("sợ")) {
    comfortMessage = "Khi tâm trí rối bời và ngập tràn lo âu về những điều chưa tới, hãy kéo sự chú ý về hiện tại ngay nơi bạn đang ngồi. Bạn đang an toàn ở đây, ngay khoảnh khắc này. Mọi thử thách đều có thể chia nhỏ ra để giải quyết từng bước một.";
    healingQuote = "Lo lắng không làm cho ngày mai bớt tồi tệ, nó chỉ làm mất đi sự bình yên của hôm nay.";
    recommendedGames = ["squishy", "mindful_breathing"];
    reasonForGames = "Bóp squishy đàn hồi tạo cảm giác kiểm soát xúc giác êm ái, kết hợp nhịp thở 4-7-8 làm dịu thần kinh.";
    realLifeTips = ["Uống chậm từng ngụm nước ấm", "Hít vào 4 giây, giữ 7 giây và thở ra từ từ trong 8 giây"];
  } else if (lower.includes("cô đơn") || lower.includes("một mình") || lower.includes("buồn") || lower.includes("khóc") || lower.includes("tủi thân")) {
    comfortMessage = "Nếu hôm nay bạn muốn khóc, cứ để những giọt nước mắt rơi nhé. Khóc không phải là yếu đuối, mà là trái tim đang dọn dẹp lại những tổn thương. Dù thế giới ngoài kia có ồn ào đến đâu, ở góc nhỏ 'Cắt đi nỗi sầu' này, mình luôn ở đây để lắng nghe bạn vô điều kiện.";
    healingQuote = "Sau cơn mưa rào, trời sẽ lại sáng trong và cầu vồng sẽ xuất hiện.";
    recommendedGames = ["zen_plant", "squishy", "doodle"];
    reasonForGames = "Gieo mầm hy vọng và nắn bóp mochi êm ái như một cái ôm dịu dàng xoa dịu trái tim bạn.";
    realLifeTips = ["Quấn mình trong một chiếc chăn ấm", "Bật một bài hát nhẹ nhàng không lời và nhắm mắt lại"];
  } else if (lower.includes("kiệt sức") || lower.includes("mệt") || lower.includes("exhausted")) {
    comfortMessage = "Bạn đã gồng gánh và chạy suốt một chặng đường dài rồi. Đã đến lúc buông chiếc ba lô nặng trĩu xuống và nằm yên nghỉ ngơi. Thế giới không sụp đổ chỉ vì bạn dừng lại một tối đâu, bản thân bạn mới là điều quý giá nhất.";
    healingQuote = "Nghỉ ngơi cũng là một phần dũng cảm của hành trình tiến lên.";
    recommendedGames = ["squishy", "mindful_breathing"];
    reasonForGames = "Không cần dùng đầu óc suy nghĩ phức tạp, chỉ cần nắn bóp nhẹ nhàng để cơ thể thả lỏng.";
    realLifeTips = ["Ngả lưng xuống giường hoặc ghế tựa 10 phút", "Nhắm mắt để đôi mắt được nghỉ ngơi"];
  }

  return {
    comfortMessage,
    healingQuote,
    recommendedGames,
    reasonForGames,
    realLifeTips,
  };
}

startServer();
