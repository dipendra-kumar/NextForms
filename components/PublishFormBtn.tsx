import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { MdOutlinePublish } from "react-icons/md";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { FaSpinner } from "react-icons/fa";
import { toast } from "./ui/use-toast";
import { publishForm, updateForm } from "@/actions/form";

import { useRouter } from "next/navigation";
import useDesigner from "./hooks/useDesigner";

const PublishFormBtn = ({ id }: { id: number }) => {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await updateForm(id, jsonElements);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  async function PublishForm() {
    try {
      await publishForm(id);
      toast({
        title: "Success",
        description: "Form has been published.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"default"} className="gap-2">
          <MdOutlinePublish className="h-4 w-4" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to publish this form?
          </AlertDialogTitle>
          <AlertDialogDescription>
            NOTE: After publishing you cannot edit this form. <br />
            <br />
            <span className="font-medium">
              {" "}
              After publishing the form will be available to the public and
              ready to collect submissions.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(updateFormContent);
              startTransition(PublishForm);
            }}
          >
            Proceed {loading && <FaSpinner className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PublishFormBtn;
