import { DetailFacts, DetailSection } from "../components/Detail"

export interface LayoutDetails {
  pages: number
  kpisUsed: string[]
  lastUpdated: string
  preview: string
  layoutType: string
  timesUsed: number
  businessQuestions: { question: string; answer: string }[]
}

const LayoutModalDetails = ({ details }: { details: LayoutDetails }) => {
  const facts: { title: string; value: string }[] = [
    { title: "Used", value: details.kpisUsed.length.toString() },
    { title: "Pages", value: details.pages.toString() },
    { title: "Last Updated", value: details.lastUpdated },
    { title: "Type", value: details.layoutType },
  ]
  return (
    <>
      <DetailFacts facts={facts} />

      <DetailSection title="Preview">
        <div className="bg-gray-300 flex items-center justify-center min-h-78"></div>
      </DetailSection>

      <DetailSection title="KPIs used in this layout">
        <div className="flex flex-wrap gap-2">
          {details.kpisUsed.map((kpi, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full"
            >
              {kpi}
            </span>
          ))}
        </div>
      </DetailSection>

      <DetailSection title="Business questions">
        <ul className="space-y-2 grid grid-cols-2 gap-2">
          {details.businessQuestions.map((q, index) => (
            <li key={index} className="rounded-md bg-gray-200 p-2">
              <p className="font-bold">{q.question}</p>
              <p className="text-gray-600">{q.answer}</p>
            </li>
          ))}
        </ul>
      </DetailSection>
    </>
  )
}
export default LayoutModalDetails