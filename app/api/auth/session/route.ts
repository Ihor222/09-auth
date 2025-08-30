import { NextRequest, NextResponse } from 'next/server'
import { api } from '../../api'
import { cookies } from 'next/headers'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { parse } from 'cookie'

export async function GET() {
  const cookiesData = await cookies()
  //   const accessToken = cookiesData.get('accessToken')?.value
  //   const refreshToken = cookiesData.get('refreshToken')?.value

  //   if (accessToken) {
  //     return NextResponse.json({ success: true })
  //   } else if (refreshToken) {

  const res = await api.get('/auth/session', { headers: { Cookie: cookiesData.toString() } })
  const resCookies = res.headers['set-cookie']

  if (resCookies) {
    const array = Array.isArray(resCookies) ? resCookies : [resCookies]
    for (const cookiesStr of array) {
      if (cookiesStr) {
        const parsed = parse(cookiesStr)
        const options: Partial<ResponseCookie> = {
          maxAge: Number(parsed['Max-Age']),
          path: parsed.Path,
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
        }
        if (parsed.accessToken) {
          cookiesData.set('accessToken', parsed.accessToken, options)
        }
        if (parsed.refreshToken) {
          cookiesData.set('refreshToken', parsed.refreshToken, options)
        }
      }
      return NextResponse.json(res.data)
    }
    //   return NextResponse.json(res.data)
    // }
    // return NextResponse.json(res.data)
  }

  return NextResponse.json({ success: false })
}