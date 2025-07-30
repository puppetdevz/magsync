async function fetchMagnificationFile(url: string): Promise<void> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('Error fetching or parsing JSON:', error)
  }
}

if (import.meta.main) {
  const url =
    Deno.args[0] ||
    'https://raw.githubusercontent.com/Veloera/public-assets/refs/heads/main/defaults/model-ratios/flexible/completion.json'
  console.log(`Fetching JSON from: ${url}`)
  await fetchMagnificationFile(url)
}
