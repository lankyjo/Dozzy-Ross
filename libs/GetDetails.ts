export default async function getDetails() {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/landing-page/682b1579dbd56927a1ab89c6?depth=1&draft=false`;
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${process.env.PAYLOAD_SECRET}`,
                'Content-Type': 'application/json',
            }
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        const result = await res.json();
        return result;
    } catch (error) {
        console.error("Error fetching landing page details:", error);
        return null;
    }
}
