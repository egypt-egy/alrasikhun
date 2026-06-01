import { Anthropic } from '@anthropic-ai/sdk';

export const handler = async (event, context) => {
  // 1. للتأكد من أن الطلب قادم من موقعك فقط (حماية)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed - استخدم POST' }),
    };
  }

  try {
    // 2. قراءة السؤال المرسل من المتصفح (الفرونت إند)
    const buffer = JSON.parse(event.body);
    const userQuestion = buffer.question;

    // 3. الاتصال الذكي بـ Claude باستخدام المفتاح السري المخزن في Netlify تلقائياً
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: 'claude-opus-4.8', // النموذج المتطور الموضح في صورتك
      max_tokens: 1024,
      messages: [
        { 
          role: 'user', 
          content: `أنت المساعد الذكي لمطور الواجهات الأمامية محمد عصام. أجب على هذا السؤال باحترافية وبشكل مختصر كلغة مساعد شخصي: ${userQuestion}` 
        }
      ],
    });

    // 4. إرسال الإجابة مرة أخرى إلى الفرونت إند
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: response.content[0].text }),
    };

  } catch (error) {
    console.error('حدث خطأ في السيرفر:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'فشل الذكاء الاصطناعي في الرد، تأكد من الـ API Key في Netlify' }),
    };
  }
};
