export function getStructuredData(data) {
  const punkter = [
    {
      heading: `Åpning av møtet og oversikt over aksjeeiere som deltok`,
      description: [
        `Generalforsamlingen ble åpnet av styreleder ${data.styreleder} som opprettet oversikt over hvem som deltok, enten selv eller ved fullmektig. `,
        `Til stede var: ${getTilstedeList(data)}`,
      ],
    },
    {
      heading: `Valg av møteleder og noen til å skrive under protokoll sammen med møteleder`,
      description: [
        `Valgt til møteleder: ${data.moteleder}`,
        `Valgt til å underskrive protokollen: ${data.protokollforer}`,
      ],
    },
    {
      heading: `Godkjenning av innkalling og dagsorden`,
      description: [
        `Innkalling og dagsorden ble godkjent. Hvis noen hadde innsigelser mot innkalling og dagsorden må det bli tatt med her.`,
      ],
    },
    {
      heading: `Godkjenning av årsregnskap, årsberetning og revisjonsberetning for ${data.ar}, herunder utdeling av utbytte`,
      description: [
        ...(data.revisor === "ja"
          ? [`Revisor gjennomgikk revisjonsberetningen`]
          : []),
        `Årsregnskap og årsberetning ble enstemmig godkjent.`,
      ],
    },
    {
      heading: `Fastsetting av godtgjørelse til styrets medlemmer`,
      description: [
        `Styrets leder redegjorde for styrets arbeid og la frem forslag til godtgjørelse. Styrets leder godtgjøres med ${data.godtgjorelse_styreleder} kr per år for sitt verv. De øvrige styremedlemmene godtgjøres med ${data.godtgjorelse_styrmedlem} kr per år.`,
      ],
    },
    ...(data.revisor === "ja"
      ? [
          {
            heading: `Godkjenning av lønn til revisor`,
            description: [`Revisor vil bli betalt etter regning`],
          },
        ]
      : []),
    {
      heading: `Styrevalg`,
      description: [
        `Styreleder/valgkomiteens leder (dersom selskapet har valgkomite) redegjorde for at det ikke er framkommet forslag til endringer i styrets sammensetning. Forslaget om et uforandret styre ble enstemmig vedtatt.`,
        `Styret består etter valget av:`,
        `Styreleder: ${data.ny_styreleder}`,
        ...getStyremedlemer(data).map((name) => `Styremedlemer: ${name}`),
      ],
    },
    ...getExtraPunkter(data).flatMap((a, i) => [
      {
        heading: `${a["ekstra_punkt_header"]}`,
        description: [`${a["ekstra_punkt_description"]}`],
      },
    ]),
  ];
  return [
    {
      heading: data.foretaksnavn,
      description: [
        `Den ${data.dato} ble det holdt generalforsamling i ${data.foretaksnavn}`,
      ],
    },
    ...punkter.reduce(
      (acc, punkt, i) => [
        ...acc,
        {
          ...punkt,
          heading: `${i + 1}. ${punkt.heading}`,
        },
      ],
      []
    ),
    {
      description: [
        `Generalforsamlingen ble avsluttet klokken ${data.tid_avsluttet}`,
        `_____________________\nMøteleders underskrift (${data.moteleder})`,
        `_____________________\nUnderskrift av protokollunderskriver (${data.protokollforer})`,
      ],
    },
  ];
}

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
