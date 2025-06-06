export default async function getDetails() {
    try {
        // const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/landing-page/${process.env.PAYLOAD_PROFILE_ID}?depth=1&draft=false`;
        const url = 'https://ogaticket-cms.vercel.app/api/landing-page/683d5b58abbd24b8964c8ebc?depth=1&draft=false'
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
