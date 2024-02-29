'use client';
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
import { FaSpinner, FaTrash } from "react-icons/fa";
import { toast } from "./ui/use-toast";
import { deleteForm } from "@/actions/form";

import { useRouter } from "next/navigation";
const DeleteFromButton = ({ id }: { id: number }) => {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  async function DeleteForm() {
    try {
      await deleteForm(id);
      toast({
        title: "Success",
        description: "Form has been deleted.",
      });
      router.push("/")
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
        <Button variant={"destructive"} className="gap-2">
          <FaTrash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete this form?
          </AlertDialogTitle>
          <AlertDialogDescription>
            NOTE: After deleting you cannot retreive this form. <br />
            <br />
            <span className="font-medium">
              {" "}
              After deleting the form you will lose all the information of this form.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(DeleteForm);
            }}
            className="bg-red-500 hover:bg-red-600 duration-150 text-white"
          >
            Delete {loading && <FaSpinner className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteFromButton;