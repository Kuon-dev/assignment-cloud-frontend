import { Link, Outlet } from "@remix-run/react";

import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import ListingForm from "@/components/listing/form/listing-form";
import PropertyForm from "@/components/property/form/property-form";
import LeaseForm from "@/components/lease/form/lease-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function ListingLayout() {
  return (
    <>
      <Navbar />
      <div className="w-full bg-black dark:bg-grid-white/[0.1] bg-grid-black/[0.2] pb-20 pt-32">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-between">
            <Button variant="link">
              <Link to="/">&larr; Back to Home</Link>
            </Button>

            {true && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="inline-flex items-center">
                    <Plus className="w-6 h-6 mr-2" />
                    <span>Create Listing</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>List Your Property</DialogTitle>
                    <DialogDescription>
                      Enter the details below to advertise your property.
                    </DialogDescription>
                  </DialogHeader>

                  <ListingForm />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <Outlet />

          {/* <PropertyForm ownerId={"37c4f100-0016-4e91-bdf3-b975b4abec08"} /> */}
          {/* <LeaseForm tenantId="" propertyId="" /> */}

          <Footer className="pt-10 mx-auto" />
        </div>
      </div>
    </>
  );
}
