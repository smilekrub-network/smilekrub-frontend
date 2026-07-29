import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { DISCORD_URL, SERVER_IP } from '#/lib/site-content'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
  head: () => ({
    meta: [{ title: 'Smilekrub Network | ตั้งค่าเซิร์ฟเวอร์' }],
  }),
})

function AdminSettings() {
  const [whitelist, setWhitelist] = useState(true)
  const [maintenance, setMaintenance] = useState(false)
  const [autoNews, setAutoNews] = useState(true)

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        toast.add({
          title: 'บันทึกการตั้งค่าเรียบร้อย',
          description: 'ยังเป็นการสาธิตเท่านั้น ค่าที่แก้ไขจะไม่ถูกบันทึกลงเซิร์ฟเวอร์',
          type: 'success',
        })
      }}
    >
      <Card>
        <CardHeader className="border-b">
          <CardTitle>ข้อมูลเซิร์ฟเวอร์</CardTitle>
          <CardDescription>
            ข้อมูลที่แสดงบนหน้าเว็บและใช้ตรวจสอบสถานะเซิร์ฟเวอร์
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="server-ip">IP เซิร์ฟเวอร์</FieldLabel>
              <Input id="server-ip" defaultValue={SERVER_IP} />
              <FieldDescription>
                ใช้สำหรับดึงสถานะออนไลน์และแสดงในหน้าวิธีเข้าเล่น
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="discord-url">ลิงก์ Discord</FieldLabel>
              <Input id="discord-url" defaultValue={DISCORD_URL} />
            </Field>

            <Field>
              <FieldLabel htmlFor="motd">ข้อความต้อนรับ (MOTD)</FieldLabel>
              <Textarea
                id="motd"
                rows={3}
                defaultValue="ยินดีต้อนรับสู่ Smilekrub Network — สร้าง สำรวจ และยิ้มไปด้วยกัน"
              />
              <FieldDescription>แสดงในรายการเซิร์ฟเวอร์ของผู้เล่น</FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>การเข้าเล่น</CardTitle>
          <CardDescription>ควบคุมสิทธิ์การเข้าเล่นและโหมดปิดปรับปรุง</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>เปิดใช้ Whitelist</FieldTitle>
                <FieldDescription>
                  อนุญาตเฉพาะผู้เล่นที่ผ่านการอนุมัติจากทีมงานเท่านั้น
                </FieldDescription>
              </FieldContent>
              <Switch checked={whitelist} onCheckedChange={setWhitelist} />
            </Field>

            <FieldSeparator />

            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>โหมดปิดปรับปรุง</FieldTitle>
                <FieldDescription>
                  ปิดการเข้าเล่นชั่วคราวสำหรับผู้เล่นทั่วไป ทีมงานยังเข้าได้ตามปกติ
                </FieldDescription>
              </FieldContent>
              <Switch checked={maintenance} onCheckedChange={setMaintenance} />
            </Field>

            <FieldSeparator />

            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>ประกาศข่าวลง Discord อัตโนมัติ</FieldTitle>
                <FieldDescription>
                  ส่งข่าวสารใหม่ไปยังช่องประกาศของ Discord ทันทีที่เผยแพร่
                </FieldDescription>
              </FieldContent>
              <Switch checked={autoNews} onCheckedChange={setAutoNews} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t">
          <Button variant="ghost" type="reset">
            ยกเลิก
          </Button>
          <Button type="submit">บันทึกการตั้งค่า</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
