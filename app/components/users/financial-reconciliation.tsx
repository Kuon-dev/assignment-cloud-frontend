import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/handle-error";

interface Tenant {
  id: string;
  name: string;
}

interface Payment {
  id: number;
  tenant: Tenant;
  propertyId: string;
  month: string;
  year: number;
  rent: number;
  maintenance: number;
  utilities: number;
  total: number;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Component: React.FC = ({ data, payoutData }) => {
  const [leasesData, setLeasesData] = useState<Lease[]>(data.leases);
  const [selectedLeasesData, setSelectedLeasesData] = useState<Lease>(
    leasesData[0] || null,
  );
  const [payments, setPayments] = useState<Payment[]>(() => {
    const savedPayments = localStorage.getItem("payments");
    return savedPayments ? JSON.parse(savedPayments) : [];
  });

  const currentDate = new Date();
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
    payments[0] || null,
  );
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<{
    month: string;
    year: number;
  }>({
    month: currentMonth,
    year: currentYear,
  });

  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  const calculateOwnerPayout = (payment: Payment): number => {
    return payment.rent - payment.maintenance - payment.utilities;
  };

  const handleAddPayment = () => {
    const newPayment: Payment = {
      id: payments.length + 1,
      tenant: {
        id: selectedLeasesData.tenantId,
        name:
          selectedLeasesData.tenantFirstName +
          " " +
          selectedLeasesData.tenantLastName,
      },
      propertyId: selectedLeasesData.propertyId,
      month: selectedMonth.month,
      year: selectedMonth.year,
      rent: selectedLeasesData.rentAmount,
      maintenance: 0,
      utilities: 0,
      total: selectedLeasesData.rentAmount,
    };
    setPayments([...payments, newPayment]);
    setSelectedPayment(newPayment);
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
  };

  const handleLocalSavePayment = () => {
    if (editingPayment) {
      const updatedPayments = payments.map((p) =>
        p.id === editingPayment.id ? editingPayment : p,
      );
      setPayments(updatedPayments);
      localStorage.setItem("payments", JSON.stringify(updatedPayments));
      setEditingPayment(null);
    }
  };

  const handleSavePayment = async () => {
    const totalAmount = filteredPayments
      .reduce((total, p) => total + calculateOwnerPayout(p), 0)
      .toFixed(2);

    const paymentToSave = {
      ownerId: payoutData.ownerId,
      payoutPeriodId: payoutData.payoutPeriodId,
      amount: parseFloat(totalAmount),
    };

    try {
      const response = await fetch(
        `${window.ENV?.BACKEND_URL}/api/Payout/owner-payouts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.authToken}`,
          },
          body: JSON.stringify(paymentToSave),
        },
      );

      if (!response.ok) {
        toast.error("Failed to save payment.");
        return;
      }

      toast.success("Payment saved successfully.");
      setEditingPayment(null);
      setPayments([]);
      localStorage.removeItem("payment");
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleDeletePayment = (payment: Payment) => {
    const updatedPayments = payments.filter((p) => p.id !== payment.id);
    setPayments(updatedPayments);
    setSelectedPayment(updatedPayments[0] || null);
  };

  const handleInputChange = (field: keyof Payment, value: number) => {
    if (editingPayment) {
      const updatedPayment = {
        ...editingPayment,
        [field]: value,
      };

      updatedPayment.total =
        updatedPayment.rent -
        updatedPayment.maintenance -
        updatedPayment.utilities;

      setEditingPayment(updatedPayment);
    }
  };

  const handlePreviousPayment = () => {
    const currentIndex = months.indexOf(selectedMonth.month);
    const newMonth = currentIndex === 0 ? 11 : currentIndex - 1;
    const newYear =
      currentIndex === 0 ? selectedMonth.year - 1 : selectedMonth.year;

    setSelectedMonth({ month: months[newMonth], year: newYear });
  };

  const handleNextPayment = () => {
    const currentIndex = months.indexOf(selectedMonth.month);
    const newMonth = currentIndex === 11 ? 0 : currentIndex + 1;
    const newYear =
      currentIndex === 11 ? selectedMonth.year + 1 : selectedMonth.year;

    setSelectedMonth({ month: months[newMonth], year: newYear });
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.month === selectedMonth.month &&
      payment.year === selectedMonth.year,
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-1">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-xl">
          Financial Reconciliation
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="tenant"
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                {selectedLeasesData.tenantFirstName}{" "}
                {selectedLeasesData.tenantLastName}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 max-h-60 overflow-y-auto"
              align="end"
            >
              <div className="grid gap-2 p-2">
                {leasesData.map((lease) => (
                  <Button
                    key={lease.id}
                    variant="ghost"
                    className="justify-start w-full"
                    onClick={() => setSelectedLeasesData(lease)}
                  >
                    {lease.tenantFirstName} {lease.tenantLastName}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid gap-6">
        <div className="border shadow-sm rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePreviousPayment}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      <span className="sr-only">Previous Payment</span>
                    </Button>
                    {selectedMonth.month} {selectedMonth.year}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNextPayment}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                      <span className="sr-only">Next Payment</span>
                    </Button>
                  </div>
                </TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Maintenance</TableHead>
                <TableHead>Utilities</TableHead>
                <TableHead className="text-right">Owner Payout</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {payment.tenant.name} - {payment.month} {payment.year}
                    </TableCell>
                    <TableCell>
                      {editingPayment && editingPayment.id === payment.id ? (
                        <Input
                          type="number"
                          value={editingPayment.rent}
                          onChange={(e) =>
                            handleInputChange(
                              "rent",
                              parseFloat(e.target.value),
                            )
                          }
                          placeholder="Rent"
                        />
                      ) : (
                        `$${payment.rent.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPayment && editingPayment.id === payment.id ? (
                        <Input
                          type="number"
                          value={editingPayment.maintenance}
                          onChange={(e) =>
                            handleInputChange(
                              "maintenance",
                              parseFloat(e.target.value),
                            )
                          }
                          placeholder="Maintenance"
                        />
                      ) : (
                        `$${payment.maintenance.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPayment && editingPayment.id === payment.id ? (
                        <Input
                          type="number"
                          value={editingPayment.utilities}
                          onChange={(e) =>
                            handleInputChange(
                              "utilities",
                              parseFloat(e.target.value),
                            )
                          }
                          placeholder="Utilities"
                        />
                      ) : (
                        `$${payment.utilities.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingPayment && editingPayment.id === payment.id ? (
                        <Input
                          type="number"
                          value={editingPayment.total}
                          onChange={(e) =>
                            handleInputChange(
                              "total",
                              parseFloat(e.target.value),
                            )
                          }
                          placeholder="Total"
                          readOnly
                        />
                      ) : (
                        `$${payment.total.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingPayment && editingPayment.id === payment.id ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleLocalSavePayment}
                        >
                          <SaveIcon className="h-4 w-4" />
                          <span className="sr-only">Save</span>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPayment(payment)}
                        >
                          <FilePenIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePayment(payment)}
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32">
                    No Payout That Is Not Submitted for {selectedMonth.month}{" "}
                    {selectedMonth.year}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end gap-2">
          {selectedMonth.month === currentMonth &&
            selectedMonth.year === currentYear && (
              <Button onClick={handleAddPayment}>Add Payment</Button>
            )}
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Owner Payout</CardTitle>
              <CardDescription>
                Total payout for {selectedMonth.month} {selectedMonth.year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>Rent</div>
                <div>
                  $
                  {filteredPayments
                    .reduce((total, p) => total + p.rent, 0)
                    .toFixed(2)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>Maintenance</div>
                <div>
                  -$
                  {filteredPayments
                    .reduce((total, p) => total + p.maintenance, 0)
                    .toFixed(2)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>Utilities</div>
                <div>
                  -$
                  {filteredPayments
                    .reduce((total, p) => total + p.utilities, 0)
                    .toFixed(2)}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <div>Total Payout</div>
                <div>
                  $
                  {filteredPayments
                    .reduce((total, p) => total + calculateOwnerPayout(p), 0)
                    .toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
          <Button className="justify-self-end" onClick={handleSavePayment}>
            Submit
          </Button>
        </div>
      </div>
    </main>
  );
};

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function FilePenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default Component;
