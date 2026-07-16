import React from 'react'

/** Renders a YouTube/Vimeo URL as a responsive iframe; falls back to a link. */
export function VideoEmbed({ url }: { url: string }) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)

  let src: string | null = null
  if (yt) src = `https://www.youtube.com/embed/${yt[1]}`
  else if (vimeo) src = `https://player.vimeo.com/video/${vimeo[1]}`

  if (!src) {
    return (
      <a className="btn btn--brand" href={url} target="_blank" rel="noopener noreferrer">
        Watch the video
      </a>
    )
  }

  return (
    <div className="video-embed">
      <iframe
        src={src}
        title="Project video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
