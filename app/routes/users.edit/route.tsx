import * as React from "react";
import { useNavigate } from "@remix-run/react";
import EditUserComponent from "@/components/users/edit-user";
import { Button } from "@/components/custom/button";
import { ClientOnly } from "remix-utils/client-only";

const EditUser = () => {
  const navigate = useNavigate();

  return (
    <ClientOnly>
      {() => (
        <div className="container mx-auto p-4 flex-grow">
          <div className="flex items-center mb-6">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <span className="mr-2">&lt;</span> Back
            </Button>
          </div>
          <EditUserComponent />
        </div>
      )}
    </ClientOnly>
  );
};

export default EditUser;
