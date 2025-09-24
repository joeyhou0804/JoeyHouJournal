'use client'

export default function TestImages() {
  const testImages = [
    "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410658/joeyhouhomepage/apjryalysi4xaxrvgocr.jpg",
    "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410975/joeyhouhomepage/ukstlvrb7pufegwvq2ka.jpg",
    "https://res.cloudinary.com/joey-hou-homepage/image/upload/v1636410190/joeyhouhomepage/nnk376sy1lzuhnxw3lhv.jpg",
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testImages.map((src, index) => (
          <div key={index} className="border p-4">
            <h3>Image {index + 1}</h3>
            <img
              src={src}
              alt={`Test image ${index + 1}`}
              className="w-full h-48 object-cover"
            />
            <p className="text-xs mt-2 break-all">{src}</p>
          </div>
        ))}
      </div>
    </div>
  )
}