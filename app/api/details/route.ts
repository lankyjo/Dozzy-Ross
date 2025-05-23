import { NextResponse } from 'next/server'
import getDetails from '@/libs/GetDetails'

export async function GET() {
    const details = await getDetails()
    return NextResponse.json(details)
}
