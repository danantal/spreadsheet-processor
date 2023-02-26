import { Fragment, FC } from "react";
import {
  Alert,
  AlertIcon,
  Divider,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

export type FileListProps = { files: File[] };

export const FileList: FC<FileListProps> = ({ files }) => {
  if (files.length === 0) {
    return (
      <Alert status="info" p={8} alignItems="center" justifyContent="center">
        <AlertIcon />
        No files selected. Add some files to get started
      </Alert>
    );
  }

  return (
    <List spacing={4}>
      {files.map((file) => (
        <Fragment key={file.name}>
          <ListItem display={"flex"} alignItems="center">
            <ListIcon as={InfoOutlineIcon} width={6} height={6} />
            <Text display={"inline"} fontSize={"sm"} color="gray.400">
              {file.name}
            </Text>
          </ListItem>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
};
