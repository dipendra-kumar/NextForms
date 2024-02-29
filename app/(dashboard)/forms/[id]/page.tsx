import { GetFormSubmissions, getFromById } from "@/actions/form";
import { ElementsType, FormElementInstance } from "@/components/FormElements";
import FormLinkShare from "@/components/FormLinkShare";
import StatCard from "@/components/StatCard";
import VisitBtn from "@/components/VisitBtn";
import DeleteFormButton from "@/components/DeleteFormBtn";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { ReactNode } from "react";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { LuView } from "react-icons/lu";
import { TbArrowBounce } from "react-icons/tb";

const FormDetailsPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { id } = params;
  const form = await getFromById(Number(id));
  if (!form) throw new Error("Form not found!");

  const { visits, submissions } = form;

  let submissionRate = 0;
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }
  const bounceRate = 100 - submissionRate;

  return (
    <>
      <div className="border-b border-muted py-10">
        <div className="container flex justify-between">
          <h1 className="truncate text-4xl font-bold">{form.name}</h1>
          <div className="flex gap-3">
          <VisitBtn shareUrl={form.shareUrl} />
          <DeleteFormButton id={form.id}/>
            </div>
        </div>
      </div>
      <div className="border-b border-muted py-4">
        <div className="border-b border-muted py-4">
          <div className="container flex items-center justify-between gap-2">
            <FormLinkShare shareUrl={form.shareUrl} />
          </div>
        </div>
      </div>
      <div className="container grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Visits"
          icon={<LuView className="text-blue-600" />}
          helperText="All time form visits"
          value={visits.toLocaleString() || ""}
          loading={false}
        />
        <StatCard
          title="Total Submissions"
          icon={<FaWpforms className="text-yellow-600" />}
          helperText="All time form submissons"
          value={submissions.toLocaleString() || ""}
          loading={false}
        />
        <StatCard
          title="Submisson Rate"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="Visits that results in form submission"
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
        />
        <StatCard
          title="Bounce Rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="Visits that leave without interacting"
          value={bounceRate.toLocaleString() + "%" || ""}
          loading={false}
        />
      </div>
      <div className="container pt-10">
        <SubmissionsTable id={form.id} />
      </div>
    </>
  );
};

export default FormDetailsPage;

type Row = { [key: string]: string } & { submittedAt: Date };

async function SubmissionsTable({ id }: { id: number }) {
  const form = await GetFormSubmissions(id);

  if (!form) {
    throw new Error("form not found");
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];

  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = [];

  form.FormSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });

  return (
    <>
      <h1 className="my-4 text-2xl font-bold">Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className=" text-right uppercase text-muted-foreground">
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="text-right text-muted-foreground">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/mm/yyyy")}</Badge>;
      break;

    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
  }

  return <TableCell>{node}</TableCell>;
}
