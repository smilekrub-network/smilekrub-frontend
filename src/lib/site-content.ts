import type { IconType } from 'react-icons'
import { FaDiscord, FaFacebook, FaTiktok, FaYoutube } from 'react-icons/fa'

export const SERVER_IP = 'alpha.sk-mc.net'
export const DISCORD_URL = 'https://discord.gg/smilekrub'

export const NAV_LINKS = [
  { label: 'จุดเด่น', href: '#features' },
  { label: 'โหมดเกม', href: '#modes' },
  { label: 'วิธีเข้าเล่น', href: '#join' },
  { label: 'ข่าวสาร', href: '#news' },
  { label: 'คอมมูนิตี้', href: '#community' },
] as const

export const FEATURES = [
  {
    icon: 'Users',
    title: 'คอมมูนิตี้อบอุ่น',
    body: 'ชุมชนผู้เล่นที่เป็นมิตร พร้อมทีมงานดูแลตลอด ไม่ต้องกลัวโดนกริฟ',
  },
  {
    icon: 'Shield',
    title: 'ป้องกันที่ดินของคุณ',
    body: 'ระบบ Claim ที่ดินใช้ง่าย ปกป้องบ้านและสมบัติของคุณจากผู้ไม่หวังดี',
  },
  {
    icon: 'Coins',
    title: 'ระบบเศรษฐกิจ',
    body: 'ตลาดผู้เล่น ร้านค้า และสกุลเงินในเซิร์ฟ ซื้อขายแลกเปลี่ยนได้อิสระ',
  },
  {
    icon: 'Briefcase',
    title: 'ระบบอาชีพ',
    body: 'เลือกอาชีพที่ชอบ ขุดแร่ ทำฟาร์ม ล่าสัตว์ เก็บเลเวลรับรางวัลพิเศษ',
  },
  {
    icon: 'CalendarDays',
    title: 'อีเวนต์ทุกสัปดาห์',
    body: 'กิจกรรมและมินิเกมสนุก ๆ พร้อมของรางวัลหายากทุกสัปดาห์',
  },
  {
    icon: 'Zap',
    title: 'ลื่นไหลไม่มีแลค',
    body: 'เซิร์ฟเวอร์สเปคแรง อยู่ในไทย Ping ต่ำ เล่นลื่นทุกช่วงเวลา',
  },
] as const

export const GAME_MODES = [
  {
    tag: 'SURVIVAL',
    icon: 'Pickaxe',
    title: 'เอาชีวิตรอด',
    body: 'โลกเอาชีวิตรอดสุดคลาสสิก พร้อมระบบอาชีพ ที่ดิน และเศรษฐกิจครบครัน',
    gradient: 'from-emerald-700 to-emerald-950',
    image: '/wallpaper/campfire_site_dawn.webp',
    cta: 'เริ่มเล่น',
    href: '#join',
    comingSoon: false,
  },
  {
    tag: 'CREATIVE',
    icon: 'Palette',
    title: 'ครีเอทีฟ',
    body: 'ปลดปล่อยจินตนาการ สร้างสรรค์ผลงานบนแปลงส่วนตัวของคุณ',
    gradient: 'from-sky-700 to-sky-950',
    image: null,
    cta: 'เร็ว ๆ นี้',
    href: '#join',
    comingSoon: true,
  },
  {
    tag: 'MINIGAMES',
    icon: 'Gamepad2',
    title: 'มินิเกม',
    body: 'สนุกกับมินิเกมหลากหลาย แข่งกับเพื่อนหรือจับทีมลุยด้วยกัน',
    gradient: 'from-amber-700 to-amber-950',
    image: null,
    cta: 'เร็ว ๆ นี้',
    href: '#join',
    comingSoon: true,
  },
] as const

export const JOIN_STEPS = [
  {
    title: 'มี Minecraft Java',
    body: 'รองรับเวอร์ชัน Java Edition ล่าสุด ต้องใช้ไอดีแท้ (Premium) เท่านั้น ไม่รองรับไอดีเถื่อน',
  },
  {
    title: 'กด Multiplayer',
    body: 'เข้าเกมแล้วเลือกเมนู Multiplayer > Add Server',
  },
  {
    title: 'วาง IP เซิร์ฟเวอร์',
    body: `คัดลอก IP ด้านล่างแล้ววางในช่อง Server Address`,
  },
  {
    title: 'เข้าเล่นได้เลย!',
    body: 'กด Join Server แล้วมาสนุกด้วยกัน',
  },
] as const

export const NEWS_ITEMS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  category: (['NEWS', 'UPDATE', 'EVENT'] as const)[i % 3],
  title: `อัปเดตเซิร์ฟเวอร์ครั้งที่ ${i + 1}`,
  gradient: [
    'from-emerald-700 to-emerald-900',
    'from-sky-700 to-sky-900',
    'from-amber-700 to-amber-900',
    'from-rose-700 to-rose-900',
    'from-violet-700 to-violet-900',
    'from-lime-700 to-lime-900',
    'from-cyan-700 to-cyan-900',
    'from-orange-700 to-orange-900',
  ][i % 8],
}))

export interface SocialLink {
  label: string
  cta: string
  href: string
  icon: IconType
  accent: string
}

export const SOCIAL_LINKS: Array<SocialLink> = [
  {
    label: 'Discord',
    cta: 'เข้าร่วม Discord พูดคุยกับเพื่อน ๆ',
    href: DISCORD_URL,
    icon: FaDiscord,
    accent: 'text-indigo-400',
  },
  {
    label: 'Facebook',
    cta: 'ติดตามข่าวสารทาง Facebook',
    href: 'https://facebook.com/smilekrub',
    icon: FaFacebook,
    accent: 'text-blue-400',
  },
  {
    label: 'TikTok',
    cta: 'คลิปสั้นสนุก ๆ จากในเซิร์ฟ',
    href: 'https://tiktok.com/@smilekrub',
    icon: FaTiktok,
    accent: 'text-pink-400',
  },
  {
    label: 'YouTube',
    cta: 'ชมไฮไลต์และอีเวนต์ย้อนหลัง',
    href: 'https://youtube.com/@smilekrub',
    icon: FaYoutube,
    accent: 'text-red-400',
  },
]
