"use client";
import { Form } from "@prisma/client";
import React, { useEffect, useState } from "react";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer from "./Designer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import useDesigner from "./hooks/useDesigner";
import { ImSpinner2 } from "react-icons/im";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import Link from "next/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Confetti from "react-confetti";

const FormBuilder = ({ form }: { form: Form }) => {
  const { setElements } = useDesigner();
  const [isReady, setIsReady] = useState<boolean>(false);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 1 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (isReady) return;
    const elements = JSON.parse(form.content);
    setElements(elements);
    const readyTimeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readyTimeout);
  }, [form, setElements]);

  if (!isReady) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <ImSpinner2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }
  const shareUrl: string = `${window.location.origin}/submit/${form.shareUrl}`;

  if (form.published) {
    return (
      <>
        <Confetti
          recycle={false}
          height={window.innerHeight}
          width={window.innerWidth}
          numberOfPieces={500}
        />
        <div className="flex h-full w-full flex-col items-center justify-center ">
          <div className="max-w-md">
            <h1 className="mb-10 border-b pb-2 text-center text-4xl font-bold text-primary">
              🎊 Form Published 🎊
            </h1>
            <h2 className="text-2xl">Share this form</h2>
            <h3 className="border-b pb-10 text-xl text-muted-foreground">
              Anyone with the link can view and submit the form.
            </h3>
            <div className="my-4 flex w-full flex-col items-center gap-2 border-b pb-4">
              <Input className="w-full" readOnly value={shareUrl} />
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast({
                    title: "Copied!",
                    description: "Link copied to the clipboard.",
                  });
                }}
              >
                Copy link
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant={"link"} asChild>
                <Link href={"/"}>
                  <BsArrowLeft /> &nbsp; Go back to home
                </Link>
              </Button>
              <Button variant={"link"} asChild>
                <Link href={"/"}>
                  Form details &nbsp;
                  <BsArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <DndContext sensors={sensors}>
      <main className="flex w-full flex-col">
        <nav className="flex items-center justify-between gap-3 border-b-2 p-4 ">
          <h2>
            <span className="mr-2 text-muted-foreground">Form: </span>
            {form.name}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn id={form.id} />
              </>
            )}
          </div>
        </nav>
        <div className="relative flex h-[200px] w-full flex-grow items-center justify-center overflow-y-auto bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
};

export default FormBuilder;
