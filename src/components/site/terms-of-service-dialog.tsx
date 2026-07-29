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
import { DISCORD_URL, SERVER_IP } from '#/lib/site-content'

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

const STATUS_ROWS = [
  { status: 'pending', desc: 'รอการตรวจสอบ/อนุมัติ Username ก่อนเข้าเล่น' },
  { status: 'approved', desc: 'อนุมัติแล้ว สามารถเข้าเล่นในเซิร์ฟเวอร์ได้' },
  { status: 'rejected', desc: 'ไม่ผ่านการตรวจสอบ เช่น Username ซ้ำหรือผิดรูปแบบ' },
  { status: 'banned', desc: 'ถูกระงับสิทธิ์จากการละเมิดกฎเซิร์ฟเวอร์' },
]

export function TermsOfServiceDialog({
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
      <DialogContent className="grid max-h-[85vh] max-w-2xl grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="gap-2 border-b border-border px-6 pt-6 pb-4">
          <MinecraftTag className="w-fit font-mc text-[10px] tracking-wider text-primary">
            TERMS OF SERVICE
          </MinecraftTag>
          <DialogTitle className="text-xl">ข้อกำหนดการใช้งาน</DialogTitle>
          <p className="text-xs text-muted-foreground">
            บังคับใช้กับการใช้งานเว็บไซต์และเซิร์ฟเวอร์ Smilekrub ({SERVER_IP})
          </p>
        </DialogHeader>

        <div className="flex min-h-0 flex-col gap-6 overflow-y-auto px-6 py-6 text-sm leading-relaxed">
          <Section title="การยอมรับข้อกำหนด">
            <p>
              การเข้าสู่ระบบและใช้งานเว็บไซต์หรือเซิร์ฟเวอร์ Smilekrub ถือว่าท่านยอมรับข้อกำหนดการใช้งานนี้
              และ{' '}
              <span className="font-medium text-foreground">นโยบายความเป็นส่วนตัว</span>{' '}
              ของเราแล้ว หากไม่ยอมรับ กรุณางดใช้บริการ
            </p>
          </Section>

          <Section title="บัญชีผู้ใช้">
            <ul>
              <li>เข้าสู่ระบบผ่าน Google OAuth เท่านั้น เราไม่มีระบบสมัครด้วยอีเมล/รหัสผ่าน</li>
              <li>1 บัญชี Google ผูกได้กับ 1 Minecraft Username เท่านั้น</li>
              <li>ท่านต้องรับผิดชอบกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของท่าน</li>
            </ul>
          </Section>

          <Section title="การสมัครเข้าเซิร์ฟเวอร์ (Whitelist)">
            <p>
              Minecraft Username ต้องมีความยาว 3–16 ตัวอักษร ประกอบด้วย a-z, A-Z, 0-9
              หรือ underscore (_) เท่านั้น และต้องไม่ถูกใช้งานโดยบัญชีอื่นไปแล้ว
              คำขอสมัครจะมีสถานะดังนี้:
            </p>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">สถานะ</th>
                    <th className="px-3 py-2 font-medium">ความหมาย</th>
                  </tr>
                </thead>
                <tbody>
                  {STATUS_ROWS.map((row) => (
                    <tr key={row.status} className="border-t border-border">
                      <td className="px-3 py-2 align-top font-mono text-xs text-foreground">
                        {row.status}
                      </td>
                      <td className="px-3 py-2 align-top">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="กฎการเล่นและมารยาทในเซิร์ฟเวอร์">
            <ul>
              <li>ห้ามใช้โปรแกรมโกง (Hack/Cheat Client), Duplication Bug หรือช่องโหว่ใด ๆ</li>
              <li>ห้ามกริฟ (Grief) ทำลาย หรือขโมยทรัพย์สินของผู้เล่นอื่นโดยไม่ได้รับอนุญาต</li>
              <li>ห้ามหลอกลวง ฉ้อโกง หรือสวมรอยเป็นผู้เล่น/ทีมงานคนอื่น</li>
              <li>ห้ามใช้ถ้อยคำหยาบคาย เหยียดเชื้อชาติ หรือคุกคามผู้เล่นอื่นในแชทหรือช่องทางชุมชน</li>
              <li>ทีมงานสงวนสิทธิ์ในการตักเตือน ระงับสิทธิ์ชั่วคราว หรือแบนถาวร แล้วแต่ความร้ายแรง</li>
            </ul>
          </Section>

          <Section title="ระบบแจ้งปัญหา (Ticket / Bug Report)">
            <ul>
              <li>ใช้แจ้งปัญหา บั๊ก หรือรายงานผู้เล่นที่ละเมิดกฎเท่านั้น ห้ามส่งเรื่องเท็จหรือสแปม</li>
              <li>ข้อมูลและรูปภาพที่แนบต้องเกี่ยวข้องกับเรื่องที่แจ้งจริง</li>
              <li>ทีมงานจะตรวจสอบและอัปเดตสถานะ Ticket ตามลำดับความสำคัญ</li>
            </ul>
          </Section>

          <Section title="เนื้อหาและทรัพย์สินทางปัญญา">
            <p>
              Smilekrub เป็นเซิร์ฟเวอร์ของแฟนคลับที่สร้างขึ้นเพื่อความบันเทิง{' '}
              <span className="font-medium text-foreground">
                ไม่มีส่วนเกี่ยวข้องหรือได้รับการรับรองจาก Mojang หรือ Microsoft
              </span>{' '}
              เครื่องหมายการค้า Minecraft เป็นของเจ้าของลิขสิทธิ์แต่เพียงผู้เดียว
            </p>
          </Section>

          <Section title="การระงับหรือยกเลิกสิทธิ์การใช้งาน">
            <p>
              ทีมงานสงวนสิทธิ์ในการระงับ ปฏิเสธ หรือยกเลิกบัญชีที่ละเมิดข้อกำหนดนี้ได้ทันที
              โดยไม่จำเป็นต้องแจ้งล่วงหน้า หากพบการกระทำที่ส่งผลเสียต่อเซิร์ฟเวอร์หรือผู้เล่นคนอื่น
            </p>
          </Section>

          <Section title="การเปลี่ยนแปลงข้อกำหนด">
            <p>
              เราอาจปรับปรุงข้อกำหนดการใช้งานนี้เป็นครั้งคราวเพื่อให้สอดคล้องกับการให้บริการ
              การใช้งานต่อหลังมีการเปลี่ยนแปลงถือว่าท่านยอมรับข้อกำหนดฉบับล่าสุดแล้ว
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
