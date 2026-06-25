import { getBookingById } from "@/lib/bookings";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
    Calendar, 
    Clock, 
    Users, 
    Phone, 
    Mail, 
    MapPin, 
    UtensilsCrossed, 
    Hotel, 
    ArrowLeft,
    CheckCircle2,
    XCircle,
    User,
    MessageSquare,
    BedDouble
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const bookingId = (await params).id;
    const booking = await getBookingById(bookingId);

    if (!booking) {
        return notFound();
    }

    const isHotel = booking.type?.toLowerCase() === "hotel";
    
    // Status Badge Color Mapping
    const statusColorMap: Record<string, string> = {
        pending: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200",
        confirmed: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200",
        rejected: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
        cancelled: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
    };

    const statusBadgeClass = statusColorMap[booking.status?.toLowerCase()] || "bg-gray-100 text-gray-800";

    const formattedDate = booking.requested_date 
        ? format(new Date(booking.requested_date), "EEEE, MMMM do, yyyy") 
        : "N/A";
        
    const formattedCheckOut = booking.check_out
        ? format(new Date(booking.check_out), "EEEE, MMMM do, yyyy")
        : null;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Link href="/bookings">
                    <Button variant="ghost" className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Bookings
                    </Button>
                </Link>
                
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`px-3 py-1 text-xs font-semibold capitalize ${statusBadgeClass}`}>
                        {booking.status}
                    </Badge>
                </div>
            </div>

            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Booking #{booking.id}
                </h1>
                <p className="text-slate-500 mt-1">
                    Created on {booking.created_at ? format(new Date(booking.created_at), "MMM d, yyyy 'at' h:mm a") : "N/A"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column - Main Details */}
                <div className="md:col-span-2 space-y-6">
                    
                    {/* Booking Details Card */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-primary-container">
                                    {isHotel ? <Hotel className="h-5 w-5" /> : <UtensilsCrossed className="h-5 w-5" />}
                                    <CardTitle className="text-lg">{isHotel ? "Accommodation" : "Restaurant"} Details</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                                
                                <div className="space-y-1.5">
                                    <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" /> Etablissement
                                    </span>
                                    <p className="font-semibold text-slate-900">{booking.listing_name || `ID: ${booking.etablissement_id}`}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5" /> Guests
                                    </span>
                                    <p className="font-semibold text-slate-900">{booking.guests} People</p>
                                </div>

                                {isHotel ? (
                                    <>
                                        <div className="space-y-1.5">
                                            <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" /> Check-in
                                            </span>
                                            <p className="font-semibold text-slate-900">{formattedDate}</p>
                                            {booking.arrival_time && <p className="text-sm text-slate-500">at {booking.arrival_time}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" /> Check-out
                                            </span>
                                            <p className="font-semibold text-slate-900">{formattedCheckOut}</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                                                <BedDouble className="h-3.5 w-3.5" /> Rooms
                                            </span>
                                            <p className="font-semibold text-slate-900">{booking.rooms} Room(s)</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                                                <span className="font-serif">DH</span> Quoted Price
                                            </span>
                                            <p className="font-semibold text-slate-900">
                                                {booking.quoted_price ? `${booking.quoted_price} DH` : "TBD"}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-1.5">
                                            <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" /> Date
                                            </span>
                                            <p className="font-semibold text-slate-900">{formattedDate}</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" /> Time
                                            </span>
                                            <p className="font-semibold text-slate-900">{booking.requested_time}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Notes Card */}
                    {(booking.customer_note || booking.owner_note) && (
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                                    <MessageSquare className="h-5 w-5" /> Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                {booking.customer_note && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 mb-2">Customer Note</h4>
                                        <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 text-amber-900 text-sm italic">
                                            "{booking.customer_note}"
                                        </div>
                                    </div>
                                )}
                                
                                {booking.customer_note && booking.owner_note && <Separator />}

                                {booking.owner_note && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 mb-2">Owner Reply</h4>
                                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-slate-700 text-sm">
                                            {booking.owner_note}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Customer Info */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                                <User className="h-5 w-5" /> Customer Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4 text-primary-container" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-0.5">Name</p>
                                    <p className="font-medium text-slate-900">{booking.customer_name}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
                                    <Mail className="h-4 w-4 text-primary-container" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 font-medium mb-0.5">Email</p>
                                    <p className="font-medium text-slate-900 truncate">
                                        <a href={`mailto:${booking.customer_email}`} className="hover:underline hover:text-primary-container transition-colors">
                                            {booking.customer_email}
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
                                    <Phone className="h-4 w-4 text-primary-container" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-0.5">Phone</p>
                                    <p className="font-medium text-slate-900">
                                        <a href={`tel:${booking.customer_phone}`} className="hover:underline hover:text-primary-container transition-colors">
                                            {booking.customer_phone || "Not provided"}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}