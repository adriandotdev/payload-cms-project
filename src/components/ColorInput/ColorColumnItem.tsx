'use client'
export const ColorColumnItem = ({ cellData }: { cellData: string }) => {
  return <div style={{ backgroundColor: cellData }} className={`px-2 py-4 max-w-[100px]`} />
}
