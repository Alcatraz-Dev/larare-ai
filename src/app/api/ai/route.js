import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be ignored
});

const formalExample = {
  swedish: [
    { word: "Sverige" },
    { word: "bor" },
    { word: "du" },
    { word: "?" },
  ],
  grammarBreakdown: [
    {
      arabic: "هل تعيش في السويد؟",
      swedish: [
        { word: "Sverige" },
        { word: "bor" },
        { word: "du" },
        { word: "?" },
      ],
      chunks: [
        {
          swedish: [{ word: "Sverige" }],
          meaning: "السويد",
          grammar: "اسم",
        },
        {
          swedish: [{ word: "bor" }],
          meaning: "يعيش",
          grammar: "فعل",
        },
        {
          swedish: [{ word: "du" }],
          meaning: "أنت",
          grammar: "ضمير",
        },
        {
          swedish: [{ word: "?" }],
          meaning: "سؤال",
          grammar: "علامة ترقيم",
        },
      ],
    },
  ],
};

const casualExample = {
  swedish: [
    { word: "Sverige" },
    { word: "bor" },
    { word: "du" },
    { word: "?" },
  ],
  grammarBreakdown: [
    {
      arabic: "هل تعيش في السويد؟",
      swedish: [
        { word: "Sverige" },
        { word: "bor" },
        { word: "du" },
        { word: "?" },
      ],
      chunks: [
        {
          swedish: [{ word: "Sverige" }],
          meaning: "السويد",
          grammar: "اسم",
        },
        {
          swedish: [{ word: "bor" }],
          meaning: "تعيش",
          grammar: "الفعل",
        },
        {
          swedish: [{ word: "du" }],
          meaning: "أنت",
          grammar: "ضمير",
        },
        {
          swedish: [{ word: "?" }],
          meaning: "سؤال",
          grammar: "علامة ترقيم",
        },
      ],
    },
  ],
};

export async function GET(req) {

  const speech = req.nextUrl.searchParams.get("speech") || "formal";
  const speechExample = speech === "formal" ? formalExample : casualExample;

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `أنت معلم لغة السويدية.
        طالبك يسألك كيف تقول شيئًا من العربية إلى السويدية.
        يجب عليك الرد بـ:
        - العربية: النسخة العربية مثل: "${speechExample.arabic}"
        - السويدية: الترجمة السويدية مقسمة إلى كلمات مثل: ${JSON.stringify(
          speechExample.swedish
        )}
        - تحليل القواعد النحوية: شرح لهيكل القواعد لكل جملة مثل: ${JSON.stringify(
          speechExample.grammarBreakdown
        )}
`,
      },
      {
        role: "system",
        content: `عليك دائمًا الرد بكائن JSON بالتنسيق التالي:
        {
          "arabic": "",
          "swedish": [{
            "word": "",
            "reading": ""
          }],
          "grammarBreakdown": [{
            "arabic": "",
            "swedish": [{
              "word": "",
              "reading": ""
            }],
            "chunks": [{
              "swedish": [{
                "word": "",
                "reading": ""
              }],
              "meaning": "",
              "grammar": ""
            }]
          }]
        }`,
      },
      {
        role: "user",
        content: `كيف تقول ${
          req.nextUrl.searchParams.get("question") ||
          "هل سبق لك أن زرت السويد؟"
        } باللغة السويدية بأسلوب ${speech}؟`,
      },
    ],
    // model: "gpt-4-turbo-preview", // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
    model: "gpt-3.5-turbo", // https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4
    response_format: {
      type: "json_object",
    },
  });
  console.log(chatCompletion.choices[0].message.content);
  return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
}
