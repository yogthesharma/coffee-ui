import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@coffee-ui/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@coffee-ui/ui/table";

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const invoices = [
  { id: "INV001", status: "Paid", email: "ada@example.com", amount: "$250.00" },
  { id: "INV002", status: "Pending", email: "linus@example.com", amount: "$150.00" },
  { id: "INV003", status: "Paid", email: "grace@example.com", amount: "$350.00" },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Recent invoices for your workspace.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.id}</TableCell>
            <TableCell>
              <Badge variant={row.status === "Paid" ? "success" : "warning"}>{row.status}</Badge>
            </TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell className="text-right tabular-nums">{row.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right tabular-nums">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
