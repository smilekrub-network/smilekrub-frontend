import type { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MinecraftTag } from '#/components/ui/minecraft-menu'
import { DISCORD_URL } from '#/lib/site-content'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5 border-l-2 border-primary/30 pl-4">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col gap-2 text-muted-foreground [&_ul]:list-disc [&_ul]:marker:text-primary [&_ul]:pl-5">
        {children}
      </div>
    </section>
  )
}

const DATA_COLLECTED = [
  {
    label: 'บัญชี Google (OAuth)',
    detail: 'อีเมล ชื่อที่แสดง และรูปโปรไฟล์ ใช้ยืนยันตัวตนเท่านั้น ไม่มีการเก็บรหัสผ่าน',
  },
  {
    label: 'โปรไฟล์ Minecraft',
    detail: 'Minecraft Username และ UUID ที่ใช้สมัครเข้าเซิร์ฟเวอร์ (whitelist)',
  },
  {
    label: 'ข้อมูลผู้เล่นในเกม',
    detail: 'สถิติ/ข้อมูลจากตัวเซิร์ฟเวอร์ Minecraft ที่ซิงก์เข้าระบบเพื่อยืนยันสถานะผู้เล่น',
  },
  {
    label: 'ข้อมูล Ticket ที่แจ้ง',
    detail: 'หัวข้อ รายละเอียด หมวดหมู่ และรูปภาพประกอบที่ท่านแนบเมื่อแจ้งปัญหา/รายงานบั๊ก',
  },
  {
    label: 'ข้อมูลทางเทคนิค',
    detail: 'Session/Cookie สำหรับการเข้าสู่ระบบ และ log การใช้งานเพื่อความปลอดภัยของระบบ',
  },
]

const RETENTION_ROWS = [
  { no: 1, item: 'บัญชีผู้ใช้ (อีเมล ชื่อ รูปโปรไฟล์จาก Google)', period: 'ตราบเท่าที่ยังใช้งานบัญชี' },
  { no: 2, item: 'Minecraft Username / UUID', period: 'ตราบเท่าที่ยังผูกกับบัญชี' },
  { no: 3, item: 'ข้อมูล Ticket และประวัติการตอบกลับ', period: '1 ปี หลังปิดเรื่อง' },
  { no: 4, item: 'Log การเข้าใช้งานระบบ', period: '90 วัน' },
]

const RIGHTS = [
  {
    title: 'สิทธิในการได้รับแจ้ง',
    body: 'ทราบว่าข้อมูลใดถูกจัดเก็บ จัดเก็บอย่างไร และนานเท่าใด',
  },
  {
    title: 'สิทธิในการเพิกถอนความยินยอม',
    body: 'เพิกถอนความยินยอมที่ให้ไว้ได้ตลอดเวลา ซึ่งอาจทำให้ไม่สามารถเข้าเล่นเซิร์ฟเวอร์ได้',
  },
  {
    title: 'สิทธิในการเข้าถึงและขอสำเนาข้อมูล',
    body: 'ขอเข้าถึงหรือขอสำเนาข้อมูลส่วนบุคคลของท่านที่เราจัดเก็บไว้',
  },
  {
    title: 'สิทธิในการแก้ไขข้อมูล',
    body: 'ขอแก้ไขข้อมูลที่ไม่ถูกต้อง เช่น เปลี่ยน Minecraft Username ที่ผูกกับบัญชี',
  },
  {
    title: 'สิทธิในการลบข้อมูล',
    body: 'ขอให้ลบบัญชีและข้อมูลที่เกี่ยวข้องออกจากระบบ',
  },
  {
    title: 'สิทธิในการคัดค้านการประมวลผล',
    body: 'คัดค้านการนำข้อมูลไปใช้ในบางวัตถุประสงค์ได้ในบางกรณี',
  },
]

export function PrivacyPolicyDialog({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Dialog>
      <DialogTrigger render={<button type="button" />} className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="grid max-h-[85vh] max-w-2xl grid-rows-[auto_1fr_auto] gap-0 overflow-hidden rounded-none border border-white/10 p-0 shadow-[0_8px_0_rgba(0,0,0,0.5)] sm:max-w-2xl">
        <DialogHeader className="items-center gap-2 border-b border-border bg-muted/30 px-6 pt-8 pb-6 text-center">
          <MinecraftTag className="w-fit font-mc text-[10px] tracking-wider text-primary">
            PRIVACY POLICY
          </MinecraftTag>
          <DialogTitle className="font-mc text-2xl tracking-wide text-foreground drop-shadow-[0_2px_0_rgba(0,0,0,0.4)] sm:text-3xl">
            นโยบายความเป็นส่วนตัว
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            บังคับใช้กับบัญชีผู้ใช้เว็บไซต์และเซิร์ฟเวอร์ Smilekrub Minecraft
          </p>
        </DialogHeader>

        <div className="flex min-h-0 flex-col gap-6 overflow-y-auto px-6 py-6 text-sm leading-relaxed">
          <Section title="ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม">
            <p>
              เราเก็บข้อมูลเท่าที่จำเป็นสำหรับการยืนยันตัวตนและให้บริการเข้าเล่นเซิร์ฟเวอร์เท่านั้น
              ไม่มีการเก็บรหัสผ่านเนื่องจากระบบเข้าสู่ระบบใช้ Google OAuth ทั้งหมด
            </p>
            <div className="mt-1 flex flex-col gap-2.5">
              {DATA_COLLECTED.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border bg-muted/30 px-3.5 py-2.5"
                >
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="แหล่งที่มาของข้อมูล">
            <ul>
              <li>จากท่านโดยตรง เมื่อสมัครเข้าเซิร์ฟเวอร์หรือแจ้ง Ticket</li>
              <li>จาก Google OAuth เมื่อเข้าสู่ระบบครั้งแรก (อีเมล ชื่อ รูปโปรไฟล์)</li>
              <li>จากตัวเซิร์ฟเวอร์ Minecraft เมื่อข้อมูลผู้เล่นถูกซิงก์เข้าระบบ</li>
            </ul>
          </Section>

          <Section title="วัตถุประสงค์ในการใช้ข้อมูล">
            <ul>
              <li>ยืนยันตัวตนและผูก Minecraft Username กับบัญชีของท่าน</li>
              <li>จัดการสิทธิ์เข้าเล่น (whitelist) และป้องกันการสวมสิทธิ์ชื่อผู้เล่น</li>
              <li>ติดตามและตอบกลับ Ticket แจ้งปัญหา/รายงานบั๊กที่ท่านส่งเข้ามา</li>
              <li>แจ้งข่าวสารและอัปเดตของเซิร์ฟเวอร์</li>
              <li>ดูแลความปลอดภัยและป้องกันการใช้งานในทางที่ผิด</li>
            </ul>
          </Section>

          <Section title="การแบ่งปันข้อมูล">
            <p>
              เราไม่ขายหรือแบ่งปันข้อมูลส่วนบุคคลของท่านให้บุคคลภายนอกเพื่อการตลาด
              ข้อมูลจะถูกใช้ภายในระบบของ Smilekrub เท่านั้น
              ยกเว้นกรณีจำเป็นตามกฎหมายหรือเพื่อป้องกันการทุจริต/ละเมิดกฎเซิร์ฟเวอร์
            </p>
          </Section>

          <Section title="ระยะเวลาในการเก็บรักษาข้อมูล">
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">ลำดับ</th>
                    <th className="px-3 py-2 font-medium">ประเภทข้อมูล</th>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">ระยะเวลาจัดเก็บ</th>
                  </tr>
                </thead>
                <tbody>
                  {RETENTION_ROWS.map((row) => (
                    <tr key={row.no} className="border-t border-border">
                      <td className="px-3 py-2 align-top">{row.no}</td>
                      <td className="px-3 py-2 align-top">{row.item}</td>
                      <td className="px-3 py-2 align-top whitespace-nowrap">{row.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="สิทธิของเจ้าของข้อมูล">
            <ul>
              {RIGHTS.map((right) => (
                <li key={right.title}>
                  <span className="font-medium text-foreground">{right.title}</span>{' '}
                  - {right.body}
                </li>
              ))}
            </ul>
            <p>
              ท่านสามารถใช้สิทธิดังกล่าวได้โดยติดต่อทีมงานผ่าน Discord ของเซิร์ฟเวอร์
              เราจะพิจารณาและตอบกลับคำร้องภายใน 30 วัน
            </p>
          </Section>
        </div>

        <DialogFooter className="flex-row items-center justify-between border-t border-border px-6 py-4 sm:justify-between">
          <Button variant="outline" render={<a href={DISCORD_URL} target="_blank" rel="noreferrer" />}>
            ติดต่อทีมงาน
          </Button>
          <span className="text-xs text-muted-foreground">อัปเดตล่าสุด 2026</span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
