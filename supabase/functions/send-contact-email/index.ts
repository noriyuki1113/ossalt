const ADMIN_EMAIL = 'noriyuki.ktm@gmail.com';
const FROM_EMAIL = 'OSSアルタナティブ <noreply@ossalt.jp>';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface ContactPayload {
  name?: string | null;
  email: string;
  category?: string;
  message: string;
  inquiry_type?: 'contact' | 'advertise';
  product_name?: string;
  plan?: string;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  apiKey: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`Resend API error [${res.status}]:`, JSON.stringify(data));
      return { ok: false, error: `Resend ${res.status}: ${JSON.stringify(data)}` };
    }
    console.log(`Email sent to ${to}: ${subject}`);
    return { ok: true };
  } catch (err) {
    console.error('sendEmail exception:', err);
    return { ok: false, error: String(err) };
  }
}

function buildAdminHtml(payload: ContactPayload): string {
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const isAdvertise = payload.inquiry_type === 'advertise';

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #2f9e8f; padding-bottom: 8px;">
        ${isAdvertise ? '広告掲載の相談' : '新しいお問い合わせ'}
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; font-weight: bold; color: #555; width: 120px;">名前</td><td style="padding: 8px;">${payload.name || '未入力'}</td></tr>
        <tr style="background: #f8f9fb;"><td style="padding: 8px; font-weight: bold; color: #555;">メール</td><td style="padding: 8px;">${payload.email}</td></tr>
        ${isAdvertise ? `
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">プロダクト名</td><td style="padding: 8px;">${payload.product_name || '未入力'}</td></tr>
          <tr style="background: #f8f9fb;"><td style="padding: 8px; font-weight: bold; color: #555;">掲載形式</td><td style="padding: 8px;">${payload.plan || '未定'}</td></tr>
        ` : `
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">種別</td><td style="padding: 8px;">${payload.category || 'その他'}</td></tr>
        `}
        <tr${isAdvertise ? '' : ' style="background: #f8f9fb;"'}><td style="padding: 8px; font-weight: bold; color: #555; vertical-align: top;">メッセージ</td><td style="padding: 8px; white-space: pre-wrap;">${(payload.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</td></tr>
      </table>
      <p style="color: #888; font-size: 12px;">送信日時: ${now}</p>
    </div>
  `;
}

function buildAutoReplyHtml(payload: ContactPayload): string {
  const isAdvertise = payload.inquiry_type === 'advertise';
  const name = payload.name || 'お客様';

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: #2f9e8f; padding: 24px; text-align: center;">
        <h1 style="color: #fff; font-size: 18px; margin: 0;">OSSアルタナティブ</h1>
      </div>
      <div style="padding: 32px 24px;">
        <p>${name} 様</p>
        <p>${isAdvertise ? '広告掲載に関するお問い合わせ' : 'お問い合わせ'}をいただき、ありがとうございます。</p>
        <p>内容を確認の上、${isAdvertise ? '2〜3営業日' : '必要に応じて'}ご連絡いたします。</p>
        <div style="background: #f8f9fb; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="font-size: 14px; font-weight: bold; margin: 0 0 8px;">お問い合わせ内容</p>
          <p style="font-size: 13px; color: #555; white-space: pre-wrap; margin: 0;">${(payload.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>
        </div>
        <p style="font-size: 13px; color: #888;">※ このメールは自動送信されています。心当たりのない場合はこのメールを無視してください。</p>
      </div>
      <div style="background: #f1f1f1; padding: 16px; text-align: center; font-size: 12px; color: #888;">
        <a href="https://ossalt.jp" style="color: #2f9e8f;">OSSアルタナティブ</a> | 有料SaaSの代替OSSを日本語で検索・比較
      </div>
    </div>
  `;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return new Response(JSON.stringify({ error: 'Server config error: RESEND_API_KEY not set' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload: ContactPayload = await req.json();
    console.log('Received contact payload:', JSON.stringify({
      email: payload.email,
      inquiry_type: payload.inquiry_type || 'contact',
      has_message: !!payload.message,
    }));

    const isAdvertise = payload.inquiry_type === 'advertise';
    const adminSubject = isAdvertise
      ? '【OSSアルタナティブ】広告掲載の相談'
      : '【OSSアルタナティブ】新しいお問い合わせ';

    const [adminResult, replyResult] = await Promise.all([
      sendEmail(ADMIN_EMAIL, adminSubject, buildAdminHtml(payload), RESEND_API_KEY),
      sendEmail(payload.email, 'お問い合わせありがとうございます | OSSアルタナティブ', buildAutoReplyHtml(payload), RESEND_API_KEY),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        admin_email: adminResult.ok ? 'sent' : 'failed',
        auto_reply: replyResult.ok ? 'sent' : 'failed',
        ...(adminResult.error && { admin_error: adminResult.error }),
        ...(replyResult.error && { reply_error: replyResult.error }),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', detail: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
