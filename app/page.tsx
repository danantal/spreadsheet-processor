"use client";

import styles from "./page.module.css";
import cx from "classnames";
import { Grid, GridItem } from "@chakra-ui/react";
import { FileScanner } from "./FileScanner";
import { FileProcessor } from "./FileProcessor";

export default function Home() {
  return (
    <main className={cx(styles.main)}>
      <Grid templateColumns="repeat(12, 1fr)" height="100%">
        <GridItem colSpan={6} p={6}>
          <FileScanner />
        </GridItem>
        <GridItem colSpan={6} p={6}>
          <FileProcessor />
        </GridItem>
      </Grid>
    </main>
  );
}
