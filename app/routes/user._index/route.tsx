import React from "react";
import ProfileComponent from "@/components/users/profile";
import { ClientOnly } from "remix-utils/client-only";
import { Button } from "@/components/custom/button";
import { useNavigate } from "@remix-run/react";

export default function UserIndex() {
  const navigate = useNavigate();

  return (
    <ClientOnly>
      {() => (
        <div className="container mx-auto p-4 flex-grow">
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <span className="mr-2">&lt;</span> Back
            </Button>
          </div>
          <ProfileComponent />
        </div>
      )}
    </ClientOnly>
  );
}
