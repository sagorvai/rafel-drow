# আমার বাড়ি.কম — Production Test Package

এই package-টি বিদ্যমান Firebase/Firestore ভিত্তিক project-এর উপর তৈরি করা হয়েছে। মূল feature flow না ভেঙে HTML-এর embedded CSS একত্র করে একটি local `style.css` করা হয়েছে এবং responsive/SEO baseline যোগ করা হয়েছে।

## গুরুত্বপূর্ণ
- Firebase config বিদ্যমান JS files-এ রাখা হয়েছে যাতে বর্তমান runtime flow অক্ষুণ্ণ থাকে।
- Leaflet/Fancybox/Material Icons-এর vendor assets এখনও CDN থেকে আসে; এগুলো functionality-এর জন্য প্রয়োজন। Local custom CSS একটিমাত্র `style.css`-এ consolidated।
- `firestore.rules` এবং `storage.rules` deploy করার আগে Firebase Console/CLI-তে project-specific existing data structure দিয়ে test করুন।
- `sitemap.xml` static pages-এর জন্য; property detail pages dynamic হওয়ায় production-এ property sitemap generation যোগ করা উত্তম।

## Firebase deploy
`firebase deploy --only firestore:rules,storage`

## Hosting
Netlify-তে folder-এর সব file upload/deploy করুন।
