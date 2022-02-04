import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export function getTilstedeList(data) {
  const moteDeltaker = Object.keys(data).filter((i) =>
    i.startsWith("motedeltager")
  );
  const list = [
    data.styreleder,
    data.protokollforer,
    data.moteleder,
    ...moteDeltaker.map((k) => data[k]),
  ];

  const uniqueSet = [...new Set(list)];

  return uniqueSet.join(", ");
}

export function getStyremedlemer(data) {
  return Object.keys(data)
    .filter((i) => i.startsWith("ny_styremedlem"))
    .map((i) => data[i]);
}

function getExtraPunkter(data) {
  const asArray = Object.entries(data);

  const filtered = asArray.filter(([key, value]) =>
    key.startsWith("ekstra_punkt")
  );

  const reduced = filtered.reduce((acc, value) => {
    const maybeHeader = value[0].replaceAll("ekstra_punkt_header", "");
    const maybeHeaderInt = parseInt(maybeHeader);
    const maybeDescription = value[0].replaceAll(
      "ekstra_punkt_description",
      ""
    );
    const maybeDescriptionInt = parseInt(maybeDescription);

    if (!Number.isNaN(maybeHeaderInt)) {
      acc[maybeHeaderInt] = acc[maybeHeaderInt]
        ? { ...acc[maybeHeaderInt], ekstra_punkt_header: value[1] }
        : { ekstra_punkt_header: value[1] };
    }

    if (!Number.isNaN(maybeDescriptionInt)) {
      acc[maybeDescriptionInt] = acc[maybeDescriptionInt]
        ? { ...acc[maybeDescriptionInt], ekstra_punkt_description: value[1] }
        : { ekstra_punkt_description: value[1] };
    }

    return acc;
  }, []);
  return reduced;
}

export function generateGeneralforsamlingsprotokoll(data) {
  getExtraPunkter(data);
  const doc = new Document({
    sections: [
      {
        creator: "protokoll",
        description: "Generalforsamlingsprotokoll",
        title: "Generalforsamlingsprotokoll",
        properties: {},
        children: [
          new Paragraph({
            spacing: {
              after: 400,
            },
            heading: HeadingLevel.TITLE,
            children: [new TextRun("Protokoll fra generalforsamling")],
          }),
          new Paragraph({
            spacing: {
              after: 400,
            },
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun(data.foretaksnavn)],
          }),
          new Paragraph({
            spacing: {
              before: 200,
            },

            children: [
              new TextRun(
                `Den ${data.dato} ble det holdt generalforsamling i ${data.foretaksnavn}`
              ),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 200,
            },
            children: [
              new TextRun(
                `1. Åpning av møtet og oversikt over aksjeeiere som deltok`
              ),
            ],
          }),
          new Paragraph({
            spacing: {
              before: 200,
            },
            children: [
              new TextRun(
                `Generalforsamlingen ble åpnet av styreleder ${data.styreleder} som opprettet oversikt over hvem som deltok, enten selv eller ved fullmektig. `
              ),
            ],
          }),
          new Paragraph({
            spacing: {
              before: 200,
            },
            children: [new TextRun(`Til stede var: ${getTilstedeList(data)}`)],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 200,
            },
            children: [
              new TextRun(
                `2. Valg av møteleder og noen til å skrive under protokoll sammen med møteleder`
              ),
            ],
          }),
          new Paragraph({
            spacing: {
              before: 200,
            },
            children: [new TextRun(`Valgt til møteleder: ${data.moteleder}`)],
          }),
          new Paragraph({
            spacing: {
              before: 200,
            },
            children: [
              new TextRun(
                `Valgt til å underskrive protokollen: ${data.protokollforer}`
              ),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 200,
            },
            children: [
              new TextRun(`3. Godkjenning av innkalling og dagsorden`),
            ],
          }),
          new Paragraph({
            spacing: {
              before: 200,
            },
            children: [
              new TextRun(
                `Innkalling og dagsorden ble godkjent. Hvis noen hadde innsigelser mot innkalling og dagsorden må det bli tatt med her.`
              ),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 200,
            },
            children: [
              new TextRun(
                `4. Godkjenning av årsregnskap, årsberetning og revisjonsberetning for ${data.ar}, herunder utdeling av utbytte`
              ),
            ],
          }),
          ...(data.revisor === "ja"
            ? [
                new Paragraph({
                  spacing: {
                    before: 200,
                  },
                  children: [
                    new TextRun(`Revisor gjennomgikk revisjonsberetningen`),
                  ],
                }),
              ]
            : []),
          new Paragraph({
            spacing: {
              before: 200,
            },
            children: [
              new TextRun(
                `Årsregnskap og årsberetning ble enstemmig godkjent.`
              ),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 200,
            },
            children: [
              new TextRun(
                `5. Fastsetting av godtgjørelse til styrets medlemmer`
              ),
            ],
          }),
          new Paragraph({
            spacing: {
              before: 200,
            },
            children: [
              new TextRun(
                `Styrets leder redegjorde for styrets arbeid og la frem forslag til godtgjørelse. Styrets leder godtgjøres med ${data.godtgjorelse_styreleder} kr per år for sitt verv. De øvrige styremedlemmene godtgjøres med ${data.godtgjorelse_styrmedlem} kr per år.`
              ),
            ],
          }),
          ...(data.revisor === "ja"
            ? [
                new Paragraph({
                  heading: HeadingLevel.HEADING_2,
                  spacing: {
                    before: 200,
                  },
                  children: [new TextRun(`6. Godkjenning av lønn til revisor`)],
                }),
                new Paragraph({
                  spacing: {
                    before: 200,
                  },
                  children: [
                    new TextRun(`Revisor vil bli betalt etter regning`),
                  ],
                }),
              ]
            : []),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 200,
            },
            children: [new TextRun(`7. Styrevalg`)],
          }),
          new Paragraph({
            spacing: {
              before: 200,
            },
            children: [
              new TextRun(
                `Styreleder/valgkomiteens leder (dersom selskapet har valgkomite) redegjorde for at det ikke er framkommet forslag til endringer i styrets sammensetning. Forslaget om et uforandret styre ble enstemmig vedtatt.`
              ),
            ],
          }),
          new Paragraph({
            spacing: {
              before: 200,
            },
            children: [new TextRun(`Styret består etter valget av:`)],
          }),
          new Paragraph({
            spacing: {
              before: 200,
            },
            children: [new TextRun(`Styreleder: ${data.ny_styreleder}`)],
          }),
          ...getStyremedlemer(data).map(
            (name) =>
              new Paragraph({
                text: `Styremedlemer: ${name}`,
              })
          ),
          ...getExtraPunkter(data).flatMap((a, i) => [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 200,
              },
              children: [new TextRun(`${7 + i}. ${a["ekstra_punkt_header"]}`)],
            }),
            new Paragraph({
              spacing: {
                before: 200,
              },
              children: [new TextRun(`${a["ekstra_punkt_description"]}`)],
            }),
          ]),

          new Paragraph({
            spacing: {
              before: 600,
            },
            children: [
              new TextRun(
                `Generalforsamlingen ble avsluttet klokken ${data.tid_avsluttet}`
              ),
            ],
          }),

          new Paragraph({
            spacing: {
              before: 800,
            },
            children: [
              new TextRun(
                `_____________________\nMøteleders underskrift (${data.moteleder})`
              ),
            ],
          }),

          new Paragraph({
            spacing: {
              before: 600,
            },
            children: [
              new TextRun(
                `_____________________\nUnderskrift av protokollunderskriver (${data.protokollforer})`
              ),
            ],
          }),
        ],
      },
    ],
  });

  return doc;
}
