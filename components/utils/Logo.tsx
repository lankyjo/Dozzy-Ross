'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Logo() {
    const [logoGroup, setLogoGroup] = useState<any>(null)

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const res = await fetch('/api/details')
                const data = await res.json()
                setLogoGroup(data.logo)
            } catch (err) {
                console.error('Failed to load logo:', err)
            }
        }

        fetchLogo()
    }, [])

    if (!logoGroup) return null // or a fallback

    return (
        <Link href={'/'}>
            {logoGroup?.image ? (
                    <Image
                        width={80}
                        height={10}
                        src={logoGroup.image.url}
                        alt={logoGroup.image.alt || 'Logo'}
                    />
            ) : (
                <h1 className="text-3xl font-anton uppercase font-bold first-letter:text-primary">
                    {logoGroup.text}
                </h1>
            )}
        </Link>
    )
}
