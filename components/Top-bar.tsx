import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

type Profile = {
    id: string;
    name: string;
    email: string;
    role: string;
}

export function TopBar({ className, profile }: { className: string; profile: Profile }) {
    const initials = profile.name
        ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : profile.email[0].toUpperCase()

    return <div className={`${className} flex justify-between items-center gap-4 py-4 px-4 bg-gray-50 border-b border-gray-200`}>
        <Input className="w-1/2 bg-white p-2 shadow-sm" placeholder="Search..." />
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">{profile.name || profile.email}</span>
            <Avatar className="bg-primary text-white h-9 w-9">
                <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                    {initials}
                </AvatarFallback>
            </Avatar>
        </div>
    </div>
}