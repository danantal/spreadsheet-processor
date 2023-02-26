import { FC, useState } from "react";
import { Alert, AlertIcon, Button, Flex, VStack } from "@chakra-ui/react";
import { builder, processSpreadsheet } from "./WorkbookBuilder";

import { useStore } from "@/store";

function downloadFile(file: Blob) {
  // Create a link and set the URL using `createObjectURL`
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = URL.createObjectURL(file);
  link.download = file.name;

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link);
  link.click();

  // To make this work on Firefox we need to wait
  // a little while before removing it.
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.parentNode?.removeChild(link);
  }, 0);
}

export const FileProcessor: FC = () => {
  const files = useStore((state) => state.files);
  const [processingState, setProcessingState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const processFiles = async () => {
    try {
      setProcessingState("loading");
      for (const file of files) {
        await processSpreadsheet(file);
      }
      builder.build();
      setProcessingState("success");
    } catch (error) {
      setProcessingState("error");
      console.error({ error });
      builder.reset();
    }
  };

  const saveReport = async () => {
    downloadFile(new File([builder.data], "report.xlsx"));

    builder.reset();
    setProcessingState("idle");
  };

  return (
    <VStack gap={4}>
      <Button
        colorScheme={"blue"}
        onClick={processFiles}
        isDisabled={files.length === 0}
        isLoading={processingState === "loading"}
      >
        Process files
      </Button>
      {processingState === "success" && (
        <Alert
          status="success"
          justifyContent={"center"}
          alignItems="center"
          flexDirection={"column"}
          gap={4}
          p={8}
        >
          <Flex>
            <AlertIcon />
            The files have been merged succesfully
          </Flex>
          <Button variant={"link"} colorScheme="blue" onClick={saveReport}>
            Save report
          </Button>
        </Alert>
      )}
      {processingState === "error" && (
        <Alert
          status="error"
          justifyContent={"center"}
          alignItems="center"
          flexDirection={"column"}
          gap={4}
          p={8}
        >
          <Flex>
            <AlertIcon />
            Something went wrong. Please check the selected files and try again.
          </Flex>
        </Alert>
      )}
    </VStack>
  );
};
