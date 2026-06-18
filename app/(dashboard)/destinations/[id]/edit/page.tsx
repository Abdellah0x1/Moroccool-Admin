import { getDestinationById } from "@/lib/destinations"
import { EditDestinationForm } from "@/components/EditDestinationForm"

export default async function EditDestination({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const destination = await getDestinationById(Number(id));

    if (!destination) {
        return <div>destination not found</div>
    }

    return <EditDestinationForm destination={destination} />
}
