import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const BulkAdd = ({ token }) => {
  const [loading, setLoading] = useState(false)
  const [parsedProducts, setParsedProducts] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [progress, setProgress] = useState(0)
  const [log, setLog] = useState([])
  const [forceUpload, setForceUpload] = useState(false)

  // --- LOGIC 1: PARSE THE JS FILE ---
  const handleJsFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = (event) => {
      const fileContent = event.target.result
      try {
        // Extract Import Mappings
        const importMap = {}
        const importRegex = /import\s+(\w+)\s+from\s+['"]\.\/(.+?)['"]/g
        let match
        while ((match = importRegex.exec(fileContent)) !== null) {
            importMap[match[1]] = match[2] 
        }

        // Extract Products Array
        const startMarker = "export const products = ["
        const startIndex = fileContent.indexOf(startMarker)
        if (startIndex === -1) throw new Error("Could not find 'export const products = ['")
        
        let arrayString = fileContent.substring(startIndex + startMarker.length - 1)
        arrayString = arrayString.substring(0, arrayString.lastIndexOf("]") + 1)

        // Replace Variables with Strings
        Object.keys(importMap).forEach(variable => {
             const varRegex = new RegExp(`(?<!['"])\\b${variable}\\b(?!['"])`, 'g')
             arrayString = arrayString.replace(varRegex, `"${importMap[variable]}"`)
        })

        const finalData = new Function("return " + arrayString)()
        setParsedProducts(finalData)
        toast.success(`Parsed ${finalData.length} products!`)

      } catch (error) {
        console.error(error)
        toast.error("Error parsing JS file.")
      }
    }
  }

  // --- LOGIC 2: HANDLE IMAGES ---
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)
    toast.success(`Selected ${files.length} images`)
  }

  // --- LOGIC 3: UPLOAD TO MONGODB ---
  const handleBulkUpload = async () => {
    if (parsedProducts.length === 0) return toast.error("Please upload assets.js first")
    if (imageFiles.length === 0) return toast.error("Please upload images")

    setLoading(true)
    setLog([])
    setProgress(0)
    
    let successCount = 0
    let skippedCount = 0
    const totalItems = parsedProducts.length

    try {
        // 1. Fetch Existing Products from MongoDB
        setLog(prev => [`⏳ Fetching current list from MongoDB...`, ...prev])
        
        // We add a timestamp (?t=...) to prevent browser caching
        const listRes = await axios.get(backendUrl + '/api/product/list?t=' + Date.now())
        
        let existingNames = new Set()
        
        if (listRes.data.success) {
            const productsInDb = listRes.data.products || []
            // Create a Set of names for fast duplicate checking
            existingNames = new Set(productsInDb.map(p => p.name))
            
            setLog(prev => [`📊 Found ${productsInDb.length} items in database.`, ...prev])
            
            if (productsInDb.length < 46 && productsInDb.length > 0) {
                 setLog(prev => [`⚠️ Note: You have 46 items locally but server returned ${productsInDb.length}. Duplicates might occur.`, ...prev])
            }
        }

        // 2. Start Upload Loop
        for (let i = 0; i < totalItems; i++) {
            const product = parsedProducts[i]

            // CHECK DUPLICATES
            // If the name is in the Set, and "Force Upload" is OFF, we skip it.
            if (!forceUpload && existingNames.has(product.name)) {
                skippedCount++
                setLog(prev => [`⚠️ Skipped (Exists): ${product.name}`, ...prev])
                
                // Update progress
                const percentage = Math.round(((i + 1) / totalItems) * 100)
                setProgress(percentage)
                await new Promise(r => setTimeout(r, 5)) // Fast skip
                continue; 
            }
            
            // PREPARE UPLOAD
            try {
                const formData = new FormData()
                formData.append("name", product.name)
                formData.append("description", product.description)
                formData.append("price", product.price)
                formData.append("category", product.category)
                formData.append("subCategory", product.subCategory)
                formData.append("bestseller", product.bestseller)
                formData.append("sizes", JSON.stringify(product.sizes))

                if (product.image && product.image.length > 0) {
                    product.image.forEach((imgFileName, index) => {
                        const file = imageFiles.find(f => f.name === imgFileName)
                        if (file) formData.append(`image${index + 1}`, file)
                    })
                }

                const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

                if (response.data.success) {
                    successCount++
                    setLog(prev => [`✅ Added: ${product.name}`, ...prev])
                } else {
                    setLog(prev => [`❌ Failed: ${product.name} - ${response.data.message}`, ...prev])
                }

            } catch (error) {
                console.error(error)
                setLog(prev => [`❌ Error: ${product.name}`, ...prev])
            }

            // Update Progress
            const percentage = Math.round(((i + 1) / totalItems) * 100)
            setProgress(percentage)
            await new Promise(r => setTimeout(r, 50)) // Delay to be kind to the server
        }

        toast.success(`Done! Added: ${successCount}, Skipped: ${skippedCount}`)

    } catch (error) {
        toast.error("Failed to connect to backend")
        console.error(error)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-4xl p-5 bg-white shadow rounded'>
        <h1 className="text-2xl font-bold mb-6">Bulk Upload (MongoDB)</h1>
        
        <div className="flex flex-col gap-6 mb-8">
            {/* Step 1 */}
            <div className='border-2 border-dashed border-gray-300 p-6 rounded bg-gray-50'>
                <p className='font-bold mb-2'>Step 1: Select 'assets.js'</p>
                <input type="file" accept=".js,.jsx" onChange={handleJsFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />
            </div>

            {/* Step 2 */}
            <div className='border-2 border-dashed border-gray-300 p-6 rounded bg-gray-50'>
                <p className='font-bold mb-2'>Step 2: Select Images</p>
                <input type="file" multiple onChange={handleImagesChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>

            {/* Force Upload Toggle */}
            <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded border border-yellow-200">
                <input 
                    type="checkbox" 
                    id="forceUpload"
                    checked={forceUpload}
                    onChange={(e) => setForceUpload(e.target.checked)}
                    className="w-4 h-4 text-black accent-black"
                />
                <label htmlFor="forceUpload" className="text-sm text-gray-700 select-none cursor-pointer font-medium">
                    Force Upload (Ignore duplicates & add everything)
                </label>
            </div>

            {/* Progress Bar */}
            {loading && (
                <div className='w-full bg-gray-200 rounded-full h-4 mb-2'>
                    <div className='bg-green-600 h-4 rounded-full transition-all duration-300' style={{ width: `${progress}%` }}></div>
                    <p className='text-xs text-center mt-1 text-gray-500'>{progress}% Completed</p>
                </div>
            )}

            <button onClick={handleBulkUpload} disabled={loading || parsedProducts.length === 0} className={`w-full py-3 rounded text-white font-bold ${loading ? 'bg-gray-400' : 'bg-black'}`}>
                {loading ? "Processing..." : "START UPLOAD"}
            </button>
        </div>

        {/* Logs */}
        <div className='bg-slate-900 text-green-400 p-4 rounded h-64 overflow-y-auto font-mono text-xs'>
            {log.map((msg, idx) => <div key={idx} className='mb-1 border-b border-gray-800 pb-1'>{msg}</div>)}
        </div>
    </div>
  )
}

export default BulkAdd