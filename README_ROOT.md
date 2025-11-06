Agent AI - Nova Web (zip package)
--------------------------------
هذا الحزمة تحتوي على مشروع جاهز للتشغيل المبدئي:
- backend/: Express backend يتصل بـSupabase ويرسل رسائل إلى Telegram, Email, (stubs لـFacebook/Instagram)
- frontend/: Next.js dashboard يقرأ جدول leads من Supabase

خطوات سريعة:
1. أنشئ مشروع Supabase وأنشئ جدول leads (see deploy.sql)
2. عدل backend/.env.example ثم انسخها إلى backend/.env
3. تشغيل محلي: npm install في كل مجلد ثم npm start / npm run dev
4. نشر: backend -> Render, frontend -> Vercel
