import { DetailFacts, DetailSection } from "../components/Detail"
import { Asset } from "./shared"

export interface KpiDetails {
  businessQuestions: { question: string; answer: string }[]
  metricIds: string[]
  description: string
  calculation: string
  visualAvailable: string[]
  affiliateApplicability: string[]
  layoutType?: string
}

const KpiModalDetails = ({
  asset,
  details,
}: {
  asset: Asset
  details: KpiDetails
}) => {
  const facts: { title: string; value: string }[] = [
    { title: "Used", value: asset.used?.toString() || "" },
    { title: "Last updated", value: asset.date },
    { title: "Type", value: asset.layoutType || "" },
    {
      title: "Affiliate Applicability",
      value: details.affiliateApplicability.length.toString(),
    },
  ]
  return (
    <>
      <DetailFacts facts={facts} />
      <DetailSection title="Metric IDs">
        <div className="flex flex-wrap gap-2">
          {details.metricIds.map((id, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full font-mono"
            >
              {id}
            </span>
          ))}
        </div>
      </DetailSection>

      <DetailSection title="Calculation">
        <code className="block p-4 bg-gray-100 rounded-lg text-sm font-mono text-gray-800 overflow-x-auto">
          {details.calculation}
        </code>
      </DetailSection>

      <DetailSection title="Available Visualizations">
        <div className="flex flex-wrap gap-2">
          {details.visualAvailable.map((visual, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full"
            >
              {visual}
            </span>
          ))}
        </div>
      </DetailSection>

      <DetailSection title="Affiliate Applicability">
        <div className="flex flex-wrap gap-2">
          {details.affiliateApplicability.map((affiliate, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full"
            >
              {affiliate}
            </span>
          ))}
        </div>
      </DetailSection>
      <DetailSection title="Business Questions">
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
export default KpiModalDetails
