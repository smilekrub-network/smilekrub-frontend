import type { IconType } from 'react-icons'
import { FaDiscord, FaFacebook, FaYoutube } from 'react-icons/fa'

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

const NEWS_COVERS = [
  '/wallpaper/campfire_site_dawn.webp',
  '/wallpaper/campfire_site_dusk.webp',
  '/wallpaper/smilekrub_lobby.png',
]

export const NEWS_ITEMS = [
  {
    id: 0,
    category: 'UPDATE' as const,
    title: 'สปอนกลางใหม่มาแล้ว! ตื่นตากับ SMK Spawn 2.0',
    subtitle: 'บอลลูนลอยฟ้า หอนาฬิกา และโซนครีเอทีฟสีสันจัดเต็ม',
    author: 'ทีมงาน Smilekrub',
    publishedAt: '2026-07-14',
    gradient: 'from-emerald-700 to-emerald-900',
    body: [
      'หลังจากปิดปรับปรุงมาหลายสัปดาห์ ในที่สุดสปอนกลางเวอร์ชันใหม่ก็พร้อมให้ทุกคนได้สำรวจแล้ว ทีมบิลด์ของเราตั้งใจออกแบบให้เต็มไปด้วยรายละเอียดที่ผู้เล่นทุกคนจะได้เดินชมกันแบบเพลิน ๆ',
      'ไฮไลต์สำคัญคือหอนาฬิกาขนาดใหญ่ใจกลางสปอน บอลลูนลอยฟ้าที่ล่องอยู่เหนือกำแพงเมือง และโซนครีเอทีฟที่ปูด้วยบล็อกสีสันสดใสนับพันบล็อก แวะมาถ่ายรูปเก็บบรรยากาศกันได้เลย',
      'พบกันได้ทันทีที่เข้าเซิร์ฟเวอร์ ขอบคุณทุกคนที่รอคอยและเป็นกำลังใจให้ทีมงานเสมอมา',
    ],
  },
  {
    id: 1,
    category: 'NEWS' as const,
    title: 'เปิดระบบสมัครเข้าเซิร์ฟผ่าน Google แล้ววันนี้',
    subtitle: 'ไม่ต้องจำรหัสผ่าน ล็อกอินง่ายกว่าเดิม',
    author: 'ทีมงาน Smilekrub',
    publishedAt: '2026-07-10',
    gradient: 'from-sky-700 to-sky-900',
    body: [
      'เพื่อความปลอดภัยและความสะดวกของผู้เล่นทุกคน เราเปลี่ยนมาใช้ระบบเข้าสู่ระบบผ่านบัญชี Google เท่านั้น ไม่มีการเก็บรหัสผ่านของผู้เล่นไว้ในระบบอีกต่อไป',
      'หลังเข้าสู่ระบบ เพียงกรอก Minecraft Username ของท่านเพื่อผูกบัญชีและรอการอนุมัติเข้าเล่น ขั้นตอนทั้งหมดใช้เวลาไม่ถึงนาที',
      'หากพบปัญหาในการสมัคร สามารถแจ้งทีมงานผ่านระบบ Ticket บนเว็บไซต์ได้ตลอด 24 ชั่วโมง',
    ],
  },
  {
    id: 2,
    category: 'EVENT' as const,
    title: 'อีเวนต์ล่าสมบัติกลางป่า รับไอเทมพิเศษประจำสัปดาห์',
    subtitle: 'ใบ้เดาะ! สมบัติซ่อนอยู่แถวบริเวณแคมป์ไฟ',
    author: 'ทีมงาน Event',
    publishedAt: '2026-07-08',
    gradient: 'from-amber-700 to-amber-900',
    body: [
      'สัปดาห์นี้ทีมงานได้ซ่อนหีบสมบัติไว้หลายจุดทั่วแมพเอาชีวิตรอด ใครหาเจอก่อนมีสิทธิ์ลุ้นไอเทมพิเศษที่หาไม่ได้จากที่ไหน',
      'จุดใบ้แรกอยู่บริเวณรอบกองแคมป์ไฟใกล้สปอน ลองสำรวจพุ่มไม้และโพรงถ้ำเล็ก ๆ ดูให้ดี อาจมีอะไรซ่อนอยู่มากกว่าที่คิด',
      'กิจกรรมจะจัดขึ้นทุกสัปดาห์ ติดตามใบ้ใหม่ ๆ ได้ทางช่อง Discord ของเซิร์ฟเวอร์',
    ],
  },
  {
    id: 3,
    category: 'UPDATE' as const,
    title: 'ปรับสมดุลระบบเศรษฐกิจ ราคาไอเทมในร้านค้าเปลี่ยนแปลง',
    subtitle: 'อัปเดตราคาซื้อ-ขายให้เหมาะสมกับการเล่นระยะยาว',
    author: 'ทีมงาน Smilekrub',
    publishedAt: '2026-07-03',
    gradient: 'from-rose-700 to-rose-900',
    body: [
      'จากการเก็บข้อมูลพฤติกรรมตลาดผู้เล่นในช่วงเดือนที่ผ่านมา ทีมงานได้ปรับราคารับซื้อและขายของไอเทมหลายรายการในร้านค้ากลาง เพื่อให้ระบบเศรษฐกิจสมดุลมากขึ้น',
      'ไอเทมกลุ่มทรัพยากรหายากจะมีมูลค่าสูงขึ้นเล็กน้อย ในขณะที่ไอเทมพื้นฐานอย่างไม้และหินจะถูกปรับราคาลงเพื่อกระตุ้นการซื้อขายระหว่างผู้เล่นด้วยกันเอง',
    ],
  },
  {
    id: 4,
    category: 'NEWS' as const,
    title: 'เปิดรับสมัครทีมงาน Helper ประจำเซิร์ฟเวอร์',
    subtitle: 'อยากช่วยดูแลคอมมูนิตี้ของเรา สมัครได้เลยวันนี้',
    author: 'ทีมงาน Smilekrub',
    publishedAt: '2026-06-28',
    gradient: 'from-violet-700 to-violet-900',
    body: [
      'Smilekrub กำลังมองหาผู้เล่นที่ใจดี มีความรับผิดชอบ และอยากมีส่วนร่วมดูแลคอมมูนิตี้ให้น่าอยู่ยิ่งขึ้น มาร่วมเป็นทีม Helper กับเรา',
      'คุณสมบัติเบื้องต้น: เล่นในเซิร์ฟเวอร์มาอย่างสม่ำเสมอ ไม่มีประวัติการโดนแบน และพร้อมช่วยเหลือผู้เล่นใหม่ สนใจแจ้งความประสงค์ผ่าน Discord ได้เลย',
    ],
  },
  {
    id: 5,
    category: 'UPDATE' as const,
    title: 'แก้ไขบั๊กระบบ Claim ที่ดินซ้อนทับกันในบางพื้นที่',
    subtitle: 'อัปเดตเสถียรภาพประจำสัปดาห์',
    author: 'ทีมงาน Smilekrub',
    publishedAt: '2026-06-24',
    gradient: 'from-lime-700 to-lime-900',
    body: [
      'ทีมงานได้แก้ไขปัญหาการ Claim ที่ดินที่บางครั้งเกิดการซ้อนทับกันในโซนใกล้ชายแดนแมพ ซึ่งทำให้ผู้เล่นบางรายไม่สามารถขยายพื้นที่ได้ตามปกติ',
      'นอกจากนี้ยังมีการแก้ไขปัญหาเล็กน้อยอื่น ๆ เกี่ยวกับการซิงก์สถานะผู้เล่นและระบบแจ้งเตือนภายในเกม ขอบคุณผู้เล่นทุกคนที่ช่วยแจ้ง Ticket เข้ามา',
    ],
  },
  {
    id: 6,
    category: 'EVENT' as const,
    title: 'ประกวดภาพถ่ายในเกม หัวข้อ "บ้านในฝันของฉัน"',
    subtitle: 'ส่งผลงานบิลด์สุดสร้างสรรค์ ลุ้นรางวัลรวมมูลค่ากว่า 1,000 บาท',
    author: 'ทีมงาน Event',
    publishedAt: '2026-06-18',
    gradient: 'from-cyan-700 to-cyan-900',
    body: [
      'เปิดเวทีให้ทุกคนได้โชว์ฝีมือการบิลด์กันอีกครั้ง กับธีม "บ้านในฝันของฉัน" ไม่จำกัดสไตล์ ไม่จำกัดขนาด ขอแค่สร้างสรรค์และเป็นผลงานที่ตั้งใจทำจริง',
      'ส่งภาพถ่ายพร้อมพิกัดผลงานผ่านช่อง #ประกวดภาพถ่าย ใน Discord ภายในสิ้นเดือนนี้ ผู้ชนะจะได้รับของรางวัลและยศพิเศษประจำเซิร์ฟเวอร์',
    ],
  },
  {
    id: 7,
    category: 'NEWS' as const,
    title: 'แผนพัฒนาเซิร์ฟเวอร์ครึ่งปีหลัง 2026',
    subtitle: 'เตรียมพบกับโหมด Skyblock และระบบ Guild เร็ว ๆ นี้',
    author: 'ทีมงาน Smilekrub',
    publishedAt: '2026-06-10',
    gradient: 'from-orange-700 to-orange-900',
    body: [
      'ขอบคุณทุกคนที่เดินทางมาด้วยกันตลอดครึ่งปีแรก สำหรับครึ่งปีหลังนี้ทีมงานมีแผนเปิดโหมดเกมใหม่เพิ่มเติม ทั้ง Skyblock และมินิเกมอีกหลายรูปแบบ',
      'นอกจากนี้ยังอยู่ระหว่างพัฒนาระบบ Guild ให้ผู้เล่นสามารถรวมทีมทำกิจกรรมร่วมกันได้ง่ายขึ้น ติดตามความคืบหน้าได้ในข่าวสารถัดไป',
    ],
  },
].map((item, i) => ({ ...item, cover: NEWS_COVERS[i % NEWS_COVERS.length] }))

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
    label: 'YouTube',
    cta: 'ชมไฮไลต์และอีเวนต์ย้อนหลัง',
    href: 'https://youtube.com/@smilekrub',
    icon: FaYoutube,
    accent: 'text-red-400',
  },
]
