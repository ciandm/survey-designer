"use client";

import { useState } from "react";
import { Survey } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, ButtonProps } from "./ui/button";
import { useToast } from "./ui/use-toast";

export const DeleteSurveyButton = ({
  survey,
  children,
  ...rest
}: { survey: Survey } & ButtonProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationFn: async () => axios.delete(`/api/v1/surveys/${survey.id}`),
    onSuccess: () => {
      toast({
        title: "Survey deleted",
        description: "The survey was deleted successfully.",
      });
      setIsOpen(false);
      router.refresh();
    },
  });

  return (
    <Dialog onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" {...rest}>
          {children ?? "Delete"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently the survey.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button disabled={isPending} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button disabled={isPending} type="submit" onClick={() => mutate()}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
