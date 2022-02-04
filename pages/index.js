import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { GeneralforsamlingForm } from "../components/GeneralforsamlingsForm";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Generalforsamlingsprotokollgenerator</title>
        <meta
          name="description"
          content="Generalforsamlingsprotokollgenerator"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Generalforsamlingsprotokollgenerator</h1>

        <p className={styles.description}>
          Fyll ut informasjon om din generalforsamling, og få ut en docx med
          protokoll. Ingen informasjon lagres på noen server, alt skjer i
          nettleseren.
        </p>
        <GeneralforsamlingForm />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://jakoblind.no"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by Jakob Lind
        </a>{" "}
        <a
          href="https://twitter.com/karljakoblind"
          target="_blank"
          rel="noopener noreferrer"
        >
          @karljakoblind
        </a>
        <a
          href="https://github.com/jakoblind/protokoll"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </footer>
    </div>
  );
}
