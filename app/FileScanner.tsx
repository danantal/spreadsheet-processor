import { FC } from "react";
import { Button, HStack, VStack } from "@chakra-ui/react";
import { FileList } from "./FileList";
import { useStore } from "@/store";

export const FileScanner: FC = () => {
  const { files, addFiles, clearFiles } = useStore();

  const handleClear = () => {
    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]');

    if (fileInput) {
      fileInput.value = "";
      clearFiles();
    }
  };

  const handleChooseFiles = async () => {
    document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
  };

  return (
    <VStack gap={4} alignItems={"stretch"}>
      <FileList files={files} />
      <HStack justifyContent={"flex-end"}>
        <input
          style={{ display: "none" }}
          onChange={(event) => {
            if (event.target.files != null) {
              const files = [...event.target.files];
              addFiles(files);
            }
          }}
          type="file"
          accept=".xls, .xlsx, .xlsb"
          multiple
        />
        <Button
          variant="outline"
          colorScheme="gray"
          onClick={handleChooseFiles}
        >
          Add files
        </Button>
        <Button onClick={handleClear} colorScheme={"red"} variant="outline">
          Clear
        </Button>
      </HStack>
    </VStack>
  );
};
