import { Anthropic } from '@anthropic-ai/sdk';

// تفاصيل منصة الراسخون في العلم المستخرجة من الـ HTML بتاعك
const alrasikhunData = `
أنت المساعد الذكي الرسمي لمنصة "الراسخون في العلم" (مبادرة من أجل مصر).
معلومات المنصة الأساسية لتجيب منها المستخدم:
- الرؤية: منصة تعليمية مصرية رائدة تهدف لمحو الأمية، محاربة الجهل، نشر الوعي الثقافي والتكنولوجي والمجتمعي، وتمكين المواطنين بالعلم.
- المؤسس والمطور: المهندس محمد عصام الفيومي.
- رقم التواصل الدعم الفني: +201279350952
- مسارات المنصة الرئيسية:
  1. قسم الأساسيات: أساسيات اللغة العربية ولغات أخرى.
  2. التمكين الرقمي (التكنولوجيا): فهم عالم الإنترنت والتكنولوجيا.
  3. الوعي المجتمعي (علم الاجتماع): بناء شخصية واعية ومنتجة.
  4. القيم والأدب (الدين الإسلامي): قصص إسلامية وقضايا عن الإلحاد وصدق الدين الإسلامي.
- ميزات إضافية: المنصة تدعم تطبيق "I Top" وهو أول تطبيق تواصل اجتماعي مصري يحافظ على القيم والأخلاق.

تحدث بلباقة ووقار، وأجب باختصار ووضوح بناءً على هذه الخلفية.
`;

export default async (req, context) => {
  try {
    const { userMessage } = await req.json();

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY, 
    });

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: alrasikhunData, // تغذية كلوود ببيانات الموقع هنا مباشرة
      messages: [{ role: "user", content: userMessage }],
    });

    return new Response(JSON.stringify({ reply: response.content[0].text }), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config = {
  path: "/api/chat" // الرابط اللي هنكلمه من الـ HTML
};
