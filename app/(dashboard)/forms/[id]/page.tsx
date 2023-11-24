import { getFromById } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";
import VisitBtn from "@/components/VisitBtn";
import React from "react";

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
          <VisitBtn shareUrl={form.shareUrl} />
        </div>
      </div>
    </>
  );
};

export default FormDetailsPage;
