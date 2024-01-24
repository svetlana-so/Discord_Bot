type GifData = {
  images: {
    original: {
      url: string
    }
  }
}

type Gif = {
  data: GifData
}

export default async function fetchGif() {
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API}&tag=success`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch gif: ${response.statusText}`)
    }

    const data = (await response.json()) as Gif

    if (data) {
      return data.data.images.original.url as string
    } else {
      console.error('Giphy API response does not contain the expected data:')
      return null
    }
  } catch (error) {
    console.error('Error fetching gif:', error)
    return null
  }
}
