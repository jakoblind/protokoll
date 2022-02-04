import { Document, Paragraph, TextRun, HeadingLevel } from "docx";

import { getStructuredData } from "./data-transformer";

export function generateGeneralforsamlingsprotokoll(data) {
  const structuredData = getStructuredData(data);

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
          ...structuredData.flatMap((item) => {
            return [
              ...(item.heading
                ? [
                    new Paragraph({
                      spacing: {
                        after: 400,
                      },
                      heading: HeadingLevel.HEADING_2,
                      children: [new TextRun(item.heading)],
                    }),
                  ]
                : []),
              ...item.description.map(
                (d) =>
                  new Paragraph({
                    spacing: {
                      before: 200,
                    },

                    children: [new TextRun(d)],
                  })
              ),
            ];
          }),
        ],
      },
    ],
  });

  return doc;
}
