import { PropertiesList } from "@/app/components/properties"
import React, { Suspense } from "react"

const Page = (): React.ReactElement => {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-body font-mono">Loading catalogue...</div>}>
      <PropertiesList />
    </Suspense>
  )
} 

export default Page