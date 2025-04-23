"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clipboard,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { useState } from "react";

const TestPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="px-10">
      <div className="flex flex-col gap-4 py-4 mb-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <hr className="border-gray-300" />
        <Input placeholder="Search..." value="" className="max-w-sm" />
      </div>
      <div className="flex justify-evenly gap-10">
        <div className="flex flex-col gap-2 w-full">
          <div className="w-full">
            <Table>
              <TableCaption className="sr-only">
                A list of your tenants.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-center">Created</TableHead>
                  <TableHead className="text-center w-[100px]">
                    Status
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium flex items-center justify-center mt-3">
                    <Clipboard className="text-gray-500" size={15} />
                  </TableCell>
                  <TableCell>Red Robin</TableCell>
                  <TableCell>FREE</TableCell>
                  <TableCell className="text-center">April 16, 2025</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      className="w-full bg-green-700 text-white"
                    >
                      Active
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button>...</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center justify-center mt-3">
                    <Clipboard className="text-gray-500" size={15} />
                  </TableCell>
                  <TableCell>BASIC</TableCell>
                  <TableCell>FREE</TableCell>
                  <TableCell className="text-center">April 04, 2025</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      className="w-full bg-red-700 text-white"
                    >
                      Deleted
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button>...</Button>
                  </TableCell>
                </TableRow>
                {/* <TableRow className="bg-gray-100"> */}
                <TableRow>
                  <TableCell className="font-medium flex items-center justify-center mt-3">
                    <Clipboard className="text-gray-500" size={15} />
                  </TableCell>
                  <TableCell>Red Robin</TableCell>
                  <TableCell>PRO</TableCell>
                  <TableCell className="text-center">April 23, 2025</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      className="w-full bg-green-700 text-white"
                    >
                      Active
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button>...</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium flex items-center justify-center mt-3">
                    <Clipboard className="text-gray-500" size={15} />
                  </TableCell>
                  <TableCell>Red Robin</TableCell>
                  <TableCell>Enterprise</TableCell>
                  <TableCell className="text-center">April 11, 2025</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      className="w-full bg-green-700 text-white"
                    >
                      Active
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button>...</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>Total Tenants</TableCell>
                  <TableCell className="text-right">4</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <Button className="rounded-none" disabled variant="outline">
                <ChevronLeft /> Previous
              </Button>
            </div>
            <div className="">Page 1 of 1</div>
            <div>
              <Button className="rounded-none" disabled variant="outline">
                Next <ChevronRight />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Tenant */}
        <div className="w-full">
          <Card className="w-full">
            <CardHeader className="mb-0">
              <CardTitle className="text-4xl font-extrabold">
                <div className="flex justify-between">
                  <div>Red Robin</div>

                  <div className="bg-green-700 text-white px-2 py-1 shadow-md mb-0">
                    ACTIVE
                  </div>
                </div>
              </CardTitle>
              <CardDescription>
                <div className="flex justify-between">
                  <div>
                    21458 Red Robin Pkwy
                    <br />
                    Coeur d Alene, ID 83814
                    <br />
                    <br />
                    <p>
                      <span className="flex items-center gap-2">
                        <Phone size={15} />
                        <a href="tel:208-555-0123">208-555-0123</a>
                      </span>
                      <span className="flex items-center gap-2">
                        <Globe size={15} />
                        <a href="https://redrobin.com">redrobin.com</a>

                        <Mail size={15} />
                        <a href="mailto:support@redrobin.com">
                          support@redrobin.com
                        </a>
                      </span>
                    </p>
                  </div>
                  <div>
                    <div className="mt-0 flex justify-end">
                      <Button
                        variant="outline"
                        className="rounded-none w-full shadow-md"
                      >
                        Pro
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  Owner:{" "}
                  <span>
                    <Button
                      variant="outline"
                      className="rounded-none shadow-md"
                    >
                      Shawn Harrington
                    </Button>
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* USERS */}

              <div className="border p-2">
                <Collapsible defaultOpen={false}>
                  <CollapsibleTrigger
                    onClick={() => setIsOpen(!isOpen)}
                    className="font-bold text-2xl w-full flex justify-between items-center"
                  >
                    USERS
                    <div className="flex gap-2 items-center">
                      <span className="font-normal text-xl">(20)</span>
                      {isOpen ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell>Shawn Harrington</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell className="text-center">
                          <Badge>Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell>Ayden Harrington</TableCell>
                        <TableCell>Support</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive">Deleted</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell>Abbie Harrington</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell className="text-center">
                          <Badge>Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </Table>
                    <div className="flex justify-end mt-2">
                      <Button variant="secondary" className="rounded-none">
                        View All
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* INVOICES */}

              <div className="border p-2">
                <Collapsible defaultOpen={false}>
                  <CollapsibleTrigger
                    onClick={() => setIsOpen(!isOpen)}
                    className="font-bold text-2xl w-full flex justify-between items-center"
                  >
                    INVOICES
                    <div className="flex gap-2 items-center">
                      <span className="font-normal text-xl">(315)</span>
                      {isOpen ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="text-center">Total</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell>Lana Hammond</TableCell>
                        <TableCell className="text-right">$350.75</TableCell>
                        <TableCell className="text-center">
                          <Badge>Paid</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell>Koro Tadeo</TableCell>
                        <TableCell className="text-right">$15.99</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive">Past Due</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell>April O&quo;neill</TableCell>
                        <TableCell className="text-right">$1,023.15</TableCell>
                        <TableCell className="text-center">
                          <Badge>Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </Table>
                    <div className="flex justify-end mt-2">
                      <Button variant="secondary" className="rounded-none">
                        View All
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* CUSTOMERS */}

              <div className="border p-2">
                <Collapsible defaultOpen={false}>
                  <CollapsibleTrigger
                    onClick={() => setIsOpen(!isOpen)}
                    className="font-bold text-2xl w-full flex justify-between items-center"
                  >
                    CUSTOMERS
                    <div className="flex gap-2 items-center">
                      <span className="font-normal text-xl">(110)</span>
                      {isOpen ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell>Jake The Snake</TableCell>
                        <TableCell className="text-center">
                          <Badge>Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell>Prince of Whales</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive">Deleted</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell>Marky Mark</TableCell>
                        <TableCell className="text-center">
                          <Badge>Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </Table>
                    <div className="flex justify-end mt-2">
                      <Button variant="secondary" className="rounded-none">
                        View All
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* PRODUCTS */}

              <div className="border p-2">
                <Collapsible defaultOpen={false}>
                  <CollapsibleTrigger
                    onClick={() => setIsOpen(!isOpen)}
                    className="font-bold text-2xl w-full flex justify-between items-center"
                  >
                    PRODUCTS
                    <div className="flex gap-2 items-center">
                      <span className="font-normal text-xl">(3,002)</span>
                      {isOpen ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-center">Qty</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell className="leading-none">
                          Zyn
                          <br />
                          <span className="text-gray-600 text-xs">
                            6mg, Wintergreen
                          </span>
                        </TableCell>
                        <TableCell className="text-center">35</TableCell>
                        <TableCell className="text-center">
                          <Badge>Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell className="leading-none">
                          Playstation 4 Pro
                          <br />
                          <span className="text-gray-600 text-xs">
                            Black, 2 TB
                          </span>
                        </TableCell>
                        <TableCell className="text-center">0</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive">Deleted</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Clipboard className="text-gray-500" size={15} />
                        </TableCell>
                        <TableCell className="leading-none">
                          Wall Clock
                          <br />
                          <span className="text-gray-600 text-xs">
                            Analog, 12 inch, Large
                          </span>
                        </TableCell>
                        <TableCell className="text-center">0</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive">Deleted</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" className="rounded-none">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </Table>
                    <div className="flex justify-end mt-2">
                      <Button variant="secondary" className="rounded-none">
                        View All
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="rounded-none">
                Close
              </Button>
              <Button variant="destructive" className="rounded-none">
                Delete
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
