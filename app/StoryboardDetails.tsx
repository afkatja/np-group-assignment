import { DetailSection } from "../components/Detail"
import { CheckIcon, ExternalLinkIcon } from "../components/Icons"

export interface StoryboardDetails {
  coupledKpisFilters: string[]
  applicableAffiliates: string[]
  requestAccess: boolean
}

const StoryboardModalDetails = ({
  details,
}: {
  details: StoryboardDetails
}) => {
  return (
    <>
      <DetailSection title="Coupled KPIs / Filters">
        <ul className="space-y-2">
          {details.coupledKpisFilters.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <CheckIcon className="h-5 w-5 shrink-0 text-gray-600 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection title="Applicable Affiliates">
        <div className="flex flex-wrap gap-2">
          {details.applicableAffiliates.map((affiliate, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full"
            >
              {affiliate}
            </span>
          ))}
        </div>
      </DetailSection>

      {details.requestAccess && (
        <DetailSection title="Access">
          <div className="flex items-center gap-3 p-4 bg-gray-100 border border-gray-200 rounded-lg">
            <ExternalLinkIcon className="h-6 w-6 text-gray-600 shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Access Required</p>
              <p className="text-sm text-gray-600">
                This storyboard requires special access. Contact the content
                owner to request permission.
              </p>
            </div>
          </div>
        </DetailSection>
      )}
    </>
  )
}

export default StoryboardModalDetails
