import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface LeadPayload {
  name: string;
  phone: string;
  comment?: string;
  fbp?: string;
  fbc?: string;
  userAgent?: string;
  pageUrl?: string;
  // Forma maydonlari
  platforma?: string;
  davlat?: string;
  bog_lanish_vaqti?: string;
  contact_value?: string;
  product?: string;
  source?: string;
  // Pixel bilan dedup uchun
  event_id?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadPayload = await req.json();
    const {
      name,
      phone,
      comment,
      fbp,
      fbc,
      userAgent,
      pageUrl,
      platforma,
      davlat,
      bog_lanish_vaqti,
      contact_value,
      product,
      source,
      event_id,
    } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Ism va telefon majburiy" }, { status: 400 });
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Comment yaratish
    let finalComment = comment || "";

    if (source === "forma") {
      // Xorijiy mijozlar
      const parts: string[] = [];
      if (platforma) parts.push(`📱 Platforma: ${platforma}`);
      if (contact_value) parts.push(`👤 Username/Raqam: ${contact_value}`);
      if (davlat) parts.push(`🌍 Davlat: ${davlat}`);
      if (bog_lanish_vaqti) parts.push(`⏰ Qulay vaqt: ${bog_lanish_vaqti}`);
      if (product) parts.push(`📦 Mahsulot: ${product}`);
      parts.push(`🔗 Manba: forma sahifasi (xorijdan)`);
      finalComment = parts.join("\n");
    } else if (source === "zayavka") {
      // Ichki bozor
      const parts: string[] = [];
      if (bog_lanish_vaqti) parts.push(`⏰ Qulay vaqt: ${bog_lanish_vaqti}`);
      if (product) parts.push(`📦 Mahsulot: ${product}`);
      parts.push(`🔗 Manba: zayavka sahifasi (ichki bozor)`);
      finalComment = parts.join("\n");
    } else if (source === "homepage") {
      // Asosiy sahifadagi forma
      const parts: string[] = [];
      if (product) parts.push(`📦 Mahsulot: ${product}`);
      parts.push(`🔗 Manba: asosiy sahifa (kreslo-damber.uz)`);
      finalComment = parts.join("\n");
    }

    // 1-QADAM: AmoCRM
    let amoResult: any = null;
    try {
      amoResult = await createAmoCRMLead({
        name,
        phone,
        comment: finalComment,
        fbp,
        fbc,
        clientIp,
        userAgent: userAgent || "",
        platforma,
        davlat,
        bog_lanish_vaqti,
      });
    } catch (amoErr: any) {
      console.error("[AMOCRM XATO]", amoErr.message);
      amoResult = { error: amoErr.message };
    }

    // 2-QADAM: Meta CAPI
    let metaResult: any = null;
    try {
      metaResult = await sendToMetaCAPI({
        name,
        phone,
        fbp,
        fbc,
        clientIp,
        userAgent: userAgent || "",
        pageUrl: pageUrl || process.env.NEXT_PUBLIC_SITE_URL || "",
        contactId: amoResult?.contactId ? String(amoResult.contactId) : "",
        leadId: amoResult?.leadId ? String(amoResult.leadId) : "",
        eventId: event_id,
      });
    } catch (metaErr: any) {
      console.error("[META XATO]", metaErr.message);
      metaResult = { error: metaErr.message };
    }

    // 3-QADAM: Telegram
    try {
      await sendToTelegram({
        name,
        phone,
        platforma,
        contact_value,
        davlat,
        bog_lanish_vaqti,
        product,
        source: source || "noma'lum",
        amoLeadId: amoResult?.leadId,
      });
    } catch (tgErr: any) {
      console.error("[TELEGRAM XATO]", tgErr.message);
    }

    if (amoResult?.error && metaResult?.error) {
      return NextResponse.json(
        { error: "Xizmat vaqtincha ishlamayapti, iltimos qayta urining" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, meta: metaResult, amo: amoResult });
  } catch (err: any) {
    console.error("[LEAD API ERROR]", err);
    return NextResponse.json({ error: err.message || "Server xatoligi" }, { status: 500 });
  }
}

// TELEGRAM
async function sendToTelegram(data: {
  name: string;
  phone: string;
  platforma?: string;
  contact_value?: string;
  davlat?: string;
  bog_lanish_vaqti?: string;
  product?: string;
  source: string;
  amoLeadId?: number;
}) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("[TELEGRAM] credentials yo'q, o'tkazib yuborildi");
    return { skipped: true };
  }

  let sourceLabel = "Noma'lum manba";
  if (data.source === "forma") sourceLabel = "🌍 DAMBER — Xorijdan (forma)";
  else if (data.source === "zayavka") sourceLabel = "🇺🇿 DAMBER — Ichki bozor (zayavka)";
  else if (data.source === "homepage") sourceLabel = "🏠 DAMBER — Asosiy sahifa";

  const lines: string[] = [
    `🆕 <b>YANGI LID — DAMBER</b>`,
    ``,
    `👤 <b>Ism:</b> ${escapeHtml(data.name)}`,
    `📞 <b>Aloqa:</b> ${escapeHtml(data.phone)}`,
  ];

  if (data.platforma) lines.push(`📱 <b>Platforma:</b> ${escapeHtml(data.platforma)}`);
  if (data.davlat) lines.push(`🌐 <b>Davlat:</b> ${escapeHtml(data.davlat)}`);
  if (data.bog_lanish_vaqti) lines.push(`⏰ <b>Qulay vaqt:</b> ${escapeHtml(data.bog_lanish_vaqti)}`);
  if (data.product) lines.push(`📦 <b>Mahsulot:</b> ${escapeHtml(data.product)}`);

  lines.push(``);
  lines.push(`🔗 <b>Manba:</b> ${sourceLabel}`);
  if (data.amoLeadId) lines.push(`🆔 <b>AmoCRM ID:</b> ${data.amoLeadId}`);

  const message = lines.join("\n");

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const result = await res.json();
  if (!res.ok) {
    console.error("[TELEGRAM ERROR]", result);
    throw new Error(`Telegram API xatosi: ${result.description || "unknown"}`);
  }

  console.log("[TELEGRAM] ✅ Lid guruhga yuborildi");
  return result;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// META CAPI
async function sendToMetaCAPI(data: {
  name: string;
  phone: string;
  fbp?: string;
  fbc?: string;
  clientIp: string;
  userAgent: string;
  pageUrl: string;
  contactId: string;
  leadId: string;
  eventId?: string;
}) {
  const PIXEL_ID = process.env.META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn("[META CAPI] credentials yo'q, o'tkazib yuborildi");
    return { skipped: true };
  }

  const hash = (value: string) =>
    crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");

  const normalizedPhone = data.phone.replace(/[\s\-\(\)\+]/g, "");

  const nameParts = data.name.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  const userData: Record<string, any> = {
    ph: [hash(normalizedPhone)],
    client_ip_address: data.clientIp,
    client_user_agent: data.userAgent,
    country: [hash("uz")],
  };

  if (firstName) userData.fn = [hash(firstName)];
  if (lastName) userData.ln = [hash(lastName)];

  if (data.contactId) userData.external_id = [hash(data.contactId)];
  if (data.fbp) userData.fbp = data.fbp;
  if (data.fbc) userData.fbc = data.fbc;

  // Pixel bilan dedup uchun event_id
  const finalEventId =
    data.eventId || (data.leadId ? `lead_${data.leadId}` : `lead_${Date.now()}`);

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: finalEventId,
        event_source_url: data.pageUrl,
        action_source: "website",
        user_data: userData,
        custom_data: {
          currency: "UZS",
          value: 800000,
        },
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_TEST_EVENT_CODE }
      : {}),
  };

  console.log("[META CAPI] event_id:", finalEventId);
  console.log("[META CAPI] user_data keys:", Object.keys(userData));

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const result = await res.json();
  if (!res.ok) {
    console.error("[META CAPI ERROR]", result);
    return { error: result };
  }

  console.log("[META CAPI] ✅ Lead event yuborildi");
  return result;
}

// AMOCRM
async function createAmoCRMLead(data: {
  name: string;
  phone: string;
  comment: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
  platforma?: string;
  davlat?: string;
  bog_lanish_vaqti?: string;
}) {
  const DOMAIN = process.env.AMOCRM_DOMAIN;
  const ACCESS_TOKEN = process.env.AMOCRM_ACCESS_TOKEN;
  const FIELD_FBP = process.env.AMOCRM_FIELD_FBP;
  const FIELD_FBC = process.env.AMOCRM_FIELD_FBC;
  const FIELD_IP = process.env.AMOCRM_FIELD_IP;
  const FIELD_USER_AGENT = process.env.AMOCRM_FIELD_USER_AGENT;
  const FIELD_PLATFORMA = process.env.AMOCRM_FIELD_PLATFORMA;
  const FIELD_DAVLAT = process.env.AMOCRM_FIELD_DAVLAT;
  const FIELD_BOG_LANISH_VAQTI = process.env.AMOCRM_FIELD_BOG_LANISH_VAQTI;
  const PIPELINE_ID = process.env.AMOCRM_PIPELINE_ID
    ? parseInt(process.env.AMOCRM_PIPELINE_ID)
    : null;

  if (!DOMAIN || !ACCESS_TOKEN) {
    console.warn("[AMOCRM] credentials yo'q, o'tkazib yuborildi");
    return { skipped: true };
  }

  const baseUrl = `https://${DOMAIN}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };

  const contactCustomFields: any[] = [
    {
      field_code: "PHONE",
      values: [{ value: data.phone, enum_code: "WORK" }],
    },
  ];

  // Damber custom kontakt maydonlari
  if (FIELD_PLATFORMA && data.platforma) {
    contactCustomFields.push({
      field_id: parseInt(FIELD_PLATFORMA),
      values: [{ value: data.platforma }],
    });
  }

  if (FIELD_DAVLAT && data.davlat) {
    contactCustomFields.push({
      field_id: parseInt(FIELD_DAVLAT),
      values: [{ value: data.davlat }],
    });
  }

  if (FIELD_BOG_LANISH_VAQTI && data.bog_lanish_vaqti) {
    contactCustomFields.push({
      field_id: parseInt(FIELD_BOG_LANISH_VAQTI),
      values: [{ value: data.bog_lanish_vaqti }],
    });
  }

  const leadCustomFields: any[] = [];

  if (FIELD_FBP && data.fbp) {
    leadCustomFields.push({
      field_id: parseInt(FIELD_FBP),
      values: [{ value: data.fbp }],
    });
  }

  if (FIELD_FBC && data.fbc) {
    leadCustomFields.push({
      field_id: parseInt(FIELD_FBC),
      values: [{ value: data.fbc }],
    });
  }

  if (FIELD_IP && data.clientIp) {
    leadCustomFields.push({
      field_id: parseInt(FIELD_IP),
      values: [{ value: data.clientIp }],
    });
  }

  if (FIELD_USER_AGENT && data.userAgent) {
    leadCustomFields.push({
      field_id: parseInt(FIELD_USER_AGENT),
      values: [{ value: data.userAgent }],
    });
  }

  const unsortedPayload = [
    {
      source_name: "Damber Website",
      source_uid: `damber_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ...(PIPELINE_ID ? { pipeline_id: PIPELINE_ID } : {}),
      metadata: {
        form_id: "damber_form",
        form_name: "Damber Lead Form",
        form_page: process.env.NEXT_PUBLIC_SITE_URL || "https://kreslo-damber.uz",
        ip: data.clientIp || "127.0.0.1",
        form_sent_at: Math.floor(Date.now() / 1000),
        referer: process.env.NEXT_PUBLIC_SITE_URL || "https://kreslo-damber.uz",
      },
      _embedded: {
        leads: [
          {
            name: `${data.name} - ${data.phone}`,
            ...(PIPELINE_ID ? { pipeline_id: PIPELINE_ID } : {}),
            ...(leadCustomFields.length > 0
              ? { custom_fields_values: leadCustomFields }
              : {}),
          },
        ],
        contacts: [
          {
            name: data.name,
            custom_fields_values: contactCustomFields,
          },
        ],
      },
    },
  ];

  const unsortedRes = await fetch(`${baseUrl}/api/v4/leads/unsorted/forms`, {
    method: "POST",
    headers,
    body: JSON.stringify(unsortedPayload),
  });

  const unsortedData = await unsortedRes.json();
  if (!unsortedRes.ok) {
    console.error("[AMOCRM UNSORTED XATOLIK]", JSON.stringify(unsortedData, null, 2));
    throw new Error("AmoCRM Неразобранное ga lid yaratishda xatolik");
  }

  const unsortedItem = unsortedData?._embedded?.unsorted?.[0];
  const leadId = unsortedItem?._embedded?.leads?.[0]?.id;
  const contactId = unsortedItem?._embedded?.contacts?.[0]?.id;

  console.log("[AMOCRM] Неразобранное'ga lid tushdi! ID:", leadId);

  return { leadId, contactId };
}
