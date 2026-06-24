import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter, Search } from "lucide-react"
import Link from "next/link"
import { AccomodationTable } from "@/components/AccomodationTable"
import { getHotels } from "@/lib/Accomodation"


export default async function AccomodationsPage({ searchParams }: { searchParams: { q?: string; city?: string; rating?: string } }) {
    const params = await searchParams;
    const accomodations = await getHotels();

    const filtered = accomodations.filter((a) => {
        const search = `${a.name} ${a.address}`.toLowerCase();
        if (params.q && !search.includes(params.q.toLowerCase())) return false;
        if (params.city?.trim() && a.city?.toLowerCase() !== params.city.trim().toLowerCase()) return false;
        if (params.rating && a.rating < Number(params.rating)) return false;
        return true;
    });

    // Collect unique cities for the dropdown
    const cities = [...new Set(accomodations.map((a) => a.city).filter(Boolean))] as string[];

    return <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="space-y-1">
                <h1 className="font-bold text-3xl">Accomodations</h1>
                <p className="text-muted-foreground">
                    Manage your accomodations here
                </p>
            </div>
            <Link href="/accomodations/new">
                <Button className="bg-primary-container"><Plus /> Add Hotel</Button>
            </Link>
        </div>

        <form method="GET" className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Filters</span>
            </div>

            <div className="h-5 w-px bg-gray-200" />

            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                    name="q"
                    placeholder="Search by name or address…"
                    type="text"
                    defaultValue={params.q ?? ""}
                    className="h-9 pl-8 bg-gray-50/80 border-gray-200 focus:bg-white"
                />
            </div>

            <Select name="city" defaultValue={params.city ?? ""}>
                <SelectTrigger className="h-9 w-[150px] bg-gray-50/80 border-gray-200">
                    <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value=" ">All cities</SelectItem>
                    {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select name="rating" defaultValue={params.rating ?? ""}>
                <SelectTrigger className="h-9 w-[140px] bg-gray-50/80 border-gray-200">
                    <SelectValue placeholder="Min rating" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="3">★ 3+</SelectItem>
                    <SelectItem value="4">★ 4+</SelectItem>
                    <SelectItem value="5">★ 5</SelectItem>
                </SelectContent>
            </Select>

            <Button
                type="submit"
                size="sm"
                className="h-9 px-4 text-white shadow-sm transition-all duration-150 hover:opacity-90"
                style={{ background: "var(--primary-container)" }}
            >
                Apply
            </Button>
        </form>

        <AccomodationTable data={filtered} />
    </div>
}
