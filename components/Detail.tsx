export const DetailSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="my-6">
    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
      {title}
    </h4>
    {children}
  </div>
)

export const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
    <p className="text-gray-900 mt-1 font-bold text-center">{value}</p>
    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider text-center">
      {label}
    </p>
  </div>
)

export const DetailFacts = ({
  facts,
}: {
  facts: { title: string; value: string }[]
}) => (
  <ul className="grid grid-cols-4 gap-4">
    {facts.map(fact => (
      <li
        key={`${fact.title}-${fact.value}`}
        className="flex flex-col justify-center items-center not-last:border-r border-gray-200 pr-4 mr-4"
      >
        <p className="text-gray-900 mt-1 font-bold text-center text-lg">
          {fact.value}
        </p>
        <p className="text-md font-medium text-gray-500 text-center">
          {fact.title}
        </p>
      </li>
    ))}
  </ul>
)